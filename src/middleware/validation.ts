import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '@/types';

export function validateRequest(schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
      const validatedData = schema.parse(data);
      
      // Replace the request data with validated data
      if (target === 'body') {
        req.body = validatedData;
      } else if (target === 'query') {
        req.query = validatedData;
      } else {
        req.params = validatedData;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationErrors
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid request data'
        });
      }
    }
  };
}

export function validateBody(schema: ZodSchema) {
  return validateRequest(schema, 'body');
}

export function validateQuery(schema: ZodSchema) {
  return validateRequest(schema, 'query');
}

export function validateParams(schema: ZodSchema) {
  return validateRequest(schema, 'params');
}