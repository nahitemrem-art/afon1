import { z } from 'zod';
import { HttpClient } from './http-client';
import { TefasApiFundSchema, TefasApiFund } from './schema';

const TefasApiResponseSchema = z.object({
  success: z.boolean().default(true),
  data: z.array(TefasApiFundSchema),
  message: z.string().optional(),
});

export interface TefasApiClientConfig {
  metadataEndpoint: string;
  performanceEndpoint: string;
  defaultQuery?: Record<string, string | number>;
}

export class TefasApiClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: TefasApiClientConfig
  ) {}

  async fetchFunds(): Promise<TefasApiFund[]> {
    const params = new URLSearchParams({
      ...(this.config.defaultQuery || {}),
      random: Math.random().toString(),
    } as Record<string, string>);

    const response = await this.httpClient.get<any>(this.config.metadataEndpoint + '?' + params.toString());
    const parsed = TefasApiResponseSchema.parse(response);

    if (!parsed.success) {
      throw new Error(`TEFAS API returned error: ${parsed.message || 'Unknown error'}`);
    }

    return parsed.data;
  }
}
