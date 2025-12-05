export interface HttpConfig {
  port: number;
  host: string;
}

export interface SchedulerConfig {
  morningCron: string;
  middayCron: string;
  eveningCron: string;
  timezone?: string;
}

export interface TefasConfig {
  apiBaseUrl: string;
  scraperBaseUrl: string;
  metadataEndpoint: string;
  performanceEndpoint: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

export interface ServiceConfig {
  preferScraper: boolean;
  enableFallback: boolean;
}

export interface AppConfig {
  http: HttpConfig;
  scheduler: SchedulerConfig;
  tefas: TefasConfig;
  service: ServiceConfig;
}

export const loadConfig = (): AppConfig => ({
  http: {
    port: parseInt(process.env.PORT || '4000', 10),
    host: process.env.HOST || '0.0.0.0',
  },
  scheduler: {
    morningCron: process.env.MORNING_CRON || '0 9 * * 1-5',
    middayCron: process.env.MIDDAY_CRON || '0 13 * * 1-5',
    eveningCron: process.env.EVENING_CRON || '0 18 * * 1-5',
    timezone: process.env.CRON_TZ,
  },
  tefas: {
    apiBaseUrl: process.env.TEFAS_API_BASE_URL || 'https://www.tefas.gov.tr',
    scraperBaseUrl: process.env.TEFAS_SCRAPER_BASE_URL || 'https://www.tefas.gov.tr',
    metadataEndpoint: process.env.TEFAS_METADATA_ENDPOINT || '/api/DB/PortfoyDagitim',
    performanceEndpoint: process.env.TEFAS_PERFORMANCE_ENDPOINT || '/api/DB/FonBilgileri',
    timeout: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
    maxRetries: parseInt(process.env.HTTP_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.HTTP_RETRY_DELAY || '1000', 10),
  },
  service: {
    preferScraper: process.env.TEFAS_PREFER_SCRAPER === 'true',
    enableFallback: process.env.TEFAS_ENABLE_FALLBACK !== 'false',
  },
});
