import bcrypt from 'bcryptjs';
import { getDatabase } from '@/config/database';
import { generateToken } from '@/middleware/auth';
import { User, CreateUserRequest, LoginRequest, AuthResponse, ServiceError } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  async createUser(userData: CreateUserRequest): Promise<AuthResponse> {
    const db = getDatabase();
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(userData.email);
    if (existingUser) {
      const error: ServiceError = new Error('User with this email already exists');
      error.statusCode = 409;
      error.code = 'USER_EXISTS';
      throw error;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);
    
    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, userData.email, passwordHash, userData.name, now, now);

    // Get created user
    const user = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?')
      .get(userId) as User;

    // Generate token
    const token = generateToken(user.id, user.email);
    
    // Store session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    const tokenHash = hashToken(token);
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(sessionId, user.id, tokenHash, expiresAt, now);

    return {
      user,
      token,
      expiresIn: '7d'
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const db = getDatabase();
    
    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(credentials.email) as any;
    if (!user) {
      const error: ServiceError = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
    if (!isValidPassword) {
      const error: ServiceError = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    // Generate token
    const token = generateToken(user.id, user.email);
    
    // Store session
    const sessionId = uuidv4();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    const tokenHash = hashToken(token);
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(sessionId, user.id, tokenHash, expiresAt, now);

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: '7d'
    };
  }

  async logout(token: string): Promise<void> {
    const db = getDatabase();
    const tokenHash = hashToken(token);
    
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
  }

  async logoutAll(userId: string): Promise<void> {
    const db = getDatabase();
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
  }
}

function hashToken(token: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
}

export const authService = new AuthService();