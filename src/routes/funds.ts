import { Router, Response } from 'express';
import { fundService } from '@/services/fundService';
import { validateQuery, validateParams } from '@/middleware/validation';
import { optionalAuth } from '@/middleware/auth';
import { fundSearchSchema, fundCodeSchema, paginationSchema } from '@/types/validation';
import { AuthenticatedRequest, ApiResponse, PaginatedResponse, FundWithPerformance } from '@/types';

const router = Router();

// Search and list funds with aggregated performance windows
router.get('/', optionalAuth, validateQuery(fundSearchSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<PaginatedResponse<FundWithPerformance>>>) => {
  try {
    const result = await fundService.searchFunds(req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get fund by code with performance data
router.get('/:code', optionalAuth, validateParams(fundCodeSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse<FundWithPerformance>>) => {
  try {
    const { code } = req.params;
    const fund = await fundService.getFundByCode(code);
    
    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    res.json({
      success: true,
      data: fund
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get fund price history
router.get('/:code/history', optionalAuth, validateParams(fundCodeSchema), validateQuery(paginationSchema), async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { code } = req.params;
    const { limit = 30 } = req.query;
    
    const history = await fundService.getFundPriceHistory(code, Number(limit));
    
    res.json({
      success: true,
      data: history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get live quotes for funds
router.get('/live/quotes', optionalAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { fundCodes } = req.query;
    const codes = fundCodes ? (fundCodes as string).split(',') : undefined;
    
    const quotes = await fundService.getLiveQuotes(codes);
    
    res.json({
      success: true,
      data: quotes
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Calculate performance windows for a fund
router.post('/:code/performance', async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { code } = req.params;
    
    const performance = await fundService.calculatePerformanceWindows(code);
    
    res.json({
      success: true,
      data: performance,
      message: 'Performance windows calculated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Get fund categories
router.get('/categories/list', async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const categories = await fundService.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

export default router;