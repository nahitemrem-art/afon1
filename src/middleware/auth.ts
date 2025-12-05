import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/config/database';
import { config } from '@/config/env';
import { AuthenticatedRequest, User } from '@/types';

interface JwtPayload {
  userId: string;
  email: string;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    
    // Verify token is not revoked by checking sessions table
    const db = getDatabase();
    const tokenHash = hashToken(token);
    const session = db.prepare('SELECT * FROM sessions WHERE token_hash = ? AND expires_at > datetime("now")')
      .get(tokenHash);

    if (!session) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Get user details
    const user = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?')
      .get(decoded.userId) as User;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    
    const db = getDatabase();
    const tokenHash = hashToken(token);
    const session = db.prepare('SELECT * FROM sessions WHERE token_hash = ? AND expires_at > datetime("now")')
      .get(tokenHash);

    if (session) {
      const user = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?')
        .get(decoded.userId) as User;
      
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
  }

  next();
}

function hashToken(token: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export function revokeToken(token: string): void {
  const db = getDatabase();
  const tokenHash = hashToken(token);
  
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
}

export function revokeAllUserTokens(userId: string): void {
  const db = getDatabase();
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}