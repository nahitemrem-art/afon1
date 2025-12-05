export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || true,
};
