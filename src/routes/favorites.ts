import { Router, Response } from 'express';
import { favoritesService } from '@/services/favoritesService';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams } from '@/middleware/validation';
import { toggleFavoriteSchema, fundCodeSchema } from '@/types/validation';
import { AuthenticatedRequest, ApiResponse } from '@/types';

const router = Router();

// All favorites routes require authentication
router.use(authenticateToken);

// Toggle favorite (add/remove)
router.post('/toggle', validateBody(toggleFavoriteSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { fundCode } = req.body;
    const result = await favoritesService.toggleFavorite(req.user.id, fundCode);
    
    res.json({
      success: true,
      data: result,
      message: result.isFavorite ? 'Added to favorites' : 'Removed from favorites'
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Add to favorites
router.post('/', validateBody(toggleFavoriteSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { fundCode } = req.body;
    const result = await favoritesService.toggleFavorite(req.user.id, fundCode);
    
    if (!result.isFavorite) {
      return res.status(409).json({
        success: false,
        error: 'Fund already in favorites'
      });
    }

    res.status(201).json({
      success: true,
      data: result,
      message: 'Added to favorites'
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Remove from favorites
router.delete('/:fundCode', validateParams(fundCodeSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { fundCode } = req.params;
    await favoritesService.removeFavorite(req.user.id, fundCode);
    
    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
});

// Get user favorites
router.get('/', async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const favorites = await favoritesService.getUserFavorites(req.user.id);
    
    res.json({
      success: true,
      data: favorites
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Check if fund is favorited
router.get('/:fundCode/check', validateParams(fundCodeSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { fundCode } = req.params;
    const isFavorite = await favoritesService.isFavorite(req.user.id, fundCode);
    
    res.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

export default router;