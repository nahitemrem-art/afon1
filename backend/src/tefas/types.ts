import { z } from 'zod';

export const FundMetadataSchema = z.object({
  code: z.string(),
  title: z.string(),
  type: z.string().optional(),
  category: z.string().optional(),
  foundationDate: z.string().optional(),
  totalValue: z.number().optional(),
  totalShare: z.number().optional(),
  investorCount: z.number().optional(),
});

export const FundPerformanceSchema = z.object({
  code: z.string(),
  date: z.string(),
  price: z.number(),
  dailyReturn: z.number().optional(),
  monthlyReturn: z.number().optional(),
  threeMonthReturn: z.number().optional(),
  annualReturn: z.number().optional(),
  totalReturn: z.number().optional(),
});

export const FundDataSchema = z.object({
  metadata: FundMetadataSchema,
  performance: FundPerformanceSchema,
});

export type FundMetadata = z.infer<typeof FundMetadataSchema>;
export type FundPerformance = z.infer<typeof FundPerformanceSchema>;
export type FundData = z.infer<typeof FundDataSchema>;

export interface TefasApiResponse {
  data?: any;
  success?: boolean;
  message?: string;
}

export interface SyncResult {
  success: boolean;
  fundsSynced: number;
  errors: string[];
  timestamp: Date;
}
