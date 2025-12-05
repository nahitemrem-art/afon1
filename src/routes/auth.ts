import { Router, Response } from 'express';
import { authService } from '@/services/authService';
import { validateBody } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { createUserSchema, loginSchema } from '@/types/validation';
import { AuthenticatedRequest, ApiResponse, AuthResponse } from '@/types';

const router = Router();

// Register new user
router.post('/register', validateBody(createUserSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<AuthResponse>>) => {
  try {
    const result = await authService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.code
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Login user
router.post('/login', validateBody(loginSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<AuthResponse>>) => {
  try {
    const result = await authService.login(req.body);
    
    res.json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.code
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Logout current session
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      await authService.logout(token);
    }
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Logout all sessions
router.post('/logout-all', authenticateToken, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    await authService.logoutAll(req.user.id);
    
    res.json({
      success: true,
      message: 'All sessions logged out successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    res.json({
      success: true,
      data: req.user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;