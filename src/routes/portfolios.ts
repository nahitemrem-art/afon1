import { Router, Response } from 'express';
import { portfolioService } from '@/services/portfolioService';
import { authenticateToken } from '@/middleware/auth';
import { validateBody, validateParams } from '@/middleware/validation';
import { 
  createPortfolioSchema, 
  updatePortfolioSchema, 
  addHoldingSchema, 
  updateHoldingSchema,
  uuidSchema,
  fundCodeSchema 
} from '@/types/validation';
import { AuthenticatedRequest, ApiResponse, PortfolioWithHoldings, PortfolioHolding } from '@/types';

const router = Router();

// All portfolio routes require authentication
router.use(authenticateToken);

// Create new portfolio
router.post('/', validateBody(createPortfolioSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const portfolio = await portfolioService.createPortfolio(req.user.id, req.body);
    
    res.status(201).json({
      success: true,
      data: portfolio,
      message: 'Portfolio created successfully'
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

// Get all user portfolios
router.get('/', async (req: AuthenticatedRequest, res: Response<ApiResponse<PortfolioWithHoldings[]>>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const portfolios = await portfolioService.getUserPortfolios(req.user.id);
    
    res.json({
      success: true,
      data: portfolios
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get specific portfolio
router.get('/:id', validateParams(uuidSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<PortfolioWithHoldings>>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const portfolio = await portfolioService.getPortfolioById(id, req.user.id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }

    // Calculate and update portfolio metrics
    await portfolioService.calculatePortfolioMetrics(id);

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Update portfolio
router.put('/:id', validateParams(uuidSchema), validateBody(updatePortfolioSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const portfolio = await portfolioService.updatePortfolio(id, req.user.id, req.body);
    
    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio updated successfully'
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

// Delete portfolio
router.delete('/:id', validateParams(uuidSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    await portfolioService.deletePortfolio(id, req.user.id);
    
    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
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

// Add holding to portfolio
router.post('/:id/holdings', validateParams(uuidSchema), validateBody(addHoldingSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<PortfolioHolding>>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const holding = await portfolioService.addHolding(id, req.user.id, req.body);
    
    // Update portfolio metrics
    await portfolioService.calculatePortfolioMetrics(id);

    res.status(201).json({
      success: true,
      data: holding,
      message: 'Holding added successfully'
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

// Update holding
router.put('/:id/holdings/:fundCode', validateParams(uuidSchema), validateParams(fundCodeSchema, 'fundCode'), validateBody(updateHoldingSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<PortfolioHolding>>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id, fundCode } = req.params;
    const holding = await portfolioService.updateHolding(id, req.user.id, fundCode, req.body);
    
    // Update portfolio metrics
    await portfolioService.calculatePortfolioMetrics(id);

    res.json({
      success: true,
      data: holding,
      message: 'Holding updated successfully'
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

// Remove holding from portfolio
router.delete('/:id/holdings/:fundCode', validateParams(uuidSchema), validateParams(fundCodeSchema, 'fundCode'), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id, fundCode } = req.params;
    await portfolioService.removeHolding(id, req.user.id, fundCode);
    
    // Update portfolio metrics
    await portfolioService.calculatePortfolioMetrics(id);

    res.json({
      success: true,
      message: 'Holding removed successfully'
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

// Get portfolio transactions
router.get('/:id/transactions', validateParams(uuidSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const transactions = await portfolioService.getPortfolioTransactions(id, req.user.id);
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get portfolio metrics
router.get('/:id/metrics', validateParams(uuidSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const metrics = await portfolioService.calculatePortfolioMetrics(id);
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

export default router;