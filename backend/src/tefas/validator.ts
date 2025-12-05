import { ZodSchema, ZodError } from 'zod';
import { FundDataSchema } from './types';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export class DataValidator {
  static validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
    try {
      const validated = schema.parse(data);
      return {
        success: true,
        data: validated,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return {
        success: false,
        errors: ['Unknown validation error'],
      };
    }
  }

  static validateFundData(data: unknown) {
    return this.validate(FundDataSchema, data);
  }

  static validateBatch<T>(schema: ZodSchema<T>, dataArray: unknown[]): ValidationResult<T[]> {
    const results: T[] = [];
    const errors: string[] = [];

    dataArray.forEach((item, index) => {
      const result = this.validate(schema, item);
      if (result.success && result.data) {
        results.push(result.data);
      } else if (result.errors) {
        errors.push(`Item ${index}: ${result.errors.join(', ')}`);
      }
    });

    return {
      success: errors.length === 0,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
