import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createPortfolioSchema = z.object({
  name: z.string().min(1, 'Portfolio name is required').max(100, 'Portfolio name must be less than 100 characters'),
});

export const updatePortfolioSchema = z.object({
  name: z.string().min(1, 'Portfolio name is required').max(100, 'Portfolio name must be less than 100 characters'),
});

export const addHoldingSchema = z.object({
  fundCode: z.string().min(1, 'Fund code is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
});

export const updateHoldingSchema = z.object({
  quantity: z.number().positive('Quantity must be positive').optional(),
  averagePrice: z.number().positive('Average price must be positive').optional(),
}).refine((data) => data.quantity !== undefined || data.averagePrice !== undefined, {
  message: 'At least one field must be provided',
});

export const createTransactionSchema = z.object({
  fundCode: z.string().min(1, 'Fund code is required'),
  type: z.enum(['buy', 'sell'], { errorMap: () => ({ message: 'Type must be either buy or sell' }) }),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  date: z.string().datetime().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const fundSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minReturn: z.number().optional(),
  maxReturn: z.number().optional(),
  sortBy: z.enum(['name', 'code', 'price', 'dailyReturn', 'monthlyReturn', 'yearlyReturn', 'estimatedYield']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const toggleFavoriteSchema = z.object({
  fundCode: z.string().min(1, 'Fund code is required'),
});

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const fundCodeSchema = z.string().min(1, 'Fund code is required').max(20, 'Fund code must be less than 20 characters');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
export type AddHoldingInput = z.infer<typeof addHoldingSchema>;
export type UpdateHoldingInput = z.infer<typeof updateHoldingSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type FundSearchInput = z.infer<typeof fundSearchSchema>;
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;