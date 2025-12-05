import { HttpClient } from '../http-client';

describe('HttpClient', () => {
  it('creates a client with config', () => {
    const client = new HttpClient({
      baseURL: 'https://example.com',
      timeout: 5000,
      maxRetries: 3,
      retryDelay: 1000,
    });

    expect(client).toBeDefined();
  });

  it('creates a client with defaults', () => {
    const client = new HttpClient({
      baseURL: 'https://example.com',
    });

    expect(client).toBeDefined();
  });
});
