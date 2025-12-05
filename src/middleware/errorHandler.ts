import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export function errorHandler(err: any, req: Request, res: Response<ApiResponse>, next: NextFunction): void {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = err.details;
  } else if (err.name === 'UnauthorizedError' || err.message.includes('token')) {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.message.includes('forbidden')) {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.message.includes('already exists')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    statusCode = 400;
    message = 'Invalid reference';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  const response: ApiResponse = {
    success: false,
    error: message
  };

  if (details) {
    response.details = details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}