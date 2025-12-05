import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private client: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: HttpClientConfig) {
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TEFAS-Integration-Service/1.0',
        ...config.headers,
      },
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shouldRetry(error: AxiosError, attempt: number): boolean {
    if (attempt >= this.maxRetries) {
      return false;
    }

    if (!error.response) {
      return true;
    }

    const status = error.response.status;
    return status === 429 || status >= 500;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    let lastError: AxiosError | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this.client.get<T>(url, config);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          lastError = error;
          
          if (this.shouldRetry(error, attempt)) {
            const delayMs = this.retryDelay * Math.pow(2, attempt);
            console.log(`Request failed, retrying in ${delayMs}ms... (attempt ${attempt + 1}/${this.maxRetries})`);
            await this.delay(delayMs);
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    let lastError: AxiosError | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          lastError = error;
          
          if (this.shouldRetry(error, attempt)) {
            const delayMs = this.retryDelay * Math.pow(2, attempt);
            console.log(`Request failed, retrying in ${delayMs}ms... (attempt ${attempt + 1}/${this.maxRetries})`);
            await this.delay(delayMs);
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}
