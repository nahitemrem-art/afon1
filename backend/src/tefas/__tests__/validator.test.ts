import { DataValidator } from '../validator';
import { FundDataSchema } from '../types';
import { z } from 'zod';

describe('TEFAS Validator', () => {
  describe('validate', () => {
    it('validates correct data', () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      const data = { name: 'John', age: 30 };

      const result = DataValidator.validate(schema, data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.errors).toBeUndefined();
    });

    it('fails validation for incorrect data', () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      const data = { name: 'John', age: 'thirty' };

      const result = DataValidator.validate(schema, data);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('validateFundData', () => {
    it('validates valid fund data', () => {
      const fundData = {
        metadata: {
          code: 'TEST',
          title: 'Test Fund',
        },
        performance: {
          code: 'TEST',
          date: '2023-12-05',
          price: 1.5,
        },
      };

      const result = DataValidator.validateFundData(fundData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('fails for invalid fund data', () => {
      const fundData = {
        metadata: {
          code: 123,
          title: 'Test Fund',
        },
        performance: {
          code: 'TEST',
          date: '2023-12-05',
        },
      };

      const result = DataValidator.validateFundData(fundData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateBatch', () => {
    it('validates multiple items successfully', () => {
      const schema = z.object({ id: z.number() });
      const dataArray = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const result = DataValidator.validateBatch(schema, dataArray);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
    });

    it('collects errors for invalid items', () => {
      const schema = z.object({ id: z.number() });
      const dataArray = [{ id: 1 }, { id: 'two' }, { id: 3 }];

      const result = DataValidator.validateBatch(schema, dataArray);

      expect(result.success).toBe(false);
      expect(result.data).toHaveLength(2);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});
