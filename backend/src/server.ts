import 'dotenv/config';
import { createApp } from './app';
import { HttpClient } from './tefas/http-client';
import { TefasApiClient } from './tefas/api';
import { TefasScraper } from './tefas/scraper';
import { TefasService } from './tefas/service';
import { InMemoryFundQuoteRepository } from './repository/InMemoryFundQuoteRepository';
import { TefasScheduler } from './scheduler/TefasScheduler';
import { loadConfig } from './config/env';

const appConfig = loadConfig();
const { http, scheduler: schedulerConfig, tefas, service: serviceConfig } = appConfig;

const httpClient = new HttpClient({
  baseURL: tefas.apiBaseUrl,
  timeout: tefas.timeout,
  maxRetries: tefas.maxRetries,
  retryDelay: tefas.retryDelay,
});

const scraperClient = new HttpClient({
  baseURL: tefas.scraperBaseUrl,
  timeout: tefas.timeout,
  maxRetries: Math.max(1, tefas.maxRetries - 1),
  retryDelay: tefas.retryDelay * 2,
});

const apiClient = new TefasApiClient(httpClient, {
  metadataEndpoint: tefas.metadataEndpoint,
  performanceEndpoint: tefas.performanceEndpoint,
});

const scraper = new TefasScraper(scraperClient);
const repository = new InMemoryFundQuoteRepository();

const service = new TefasService(repository, apiClient, scraper, serviceConfig);

const scheduler = new TefasScheduler(service, {
  morning: schedulerConfig.morningCron,
  midday: schedulerConfig.middayCron,
  evening: schedulerConfig.eveningCron,
  window: 'all',
  timezone: schedulerConfig.timezone,
});

const app = createApp(service, scheduler);

const server = app.listen(http.port, http.host, () => {
  console.log(`Server is running on http://${http.host}:${http.port}`);
  console.log('Starting TEFAS scheduler...');
  scheduler.start();
});

const shutdown = () => {
  console.log('Shutting down...');
  scheduler.stop();
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
