import Constants from 'expo-constants';

export const config = {
  apiBaseUrl: Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:4000/api',
  environment: Constants.expoConfig?.extra?.environment || 'development',
  useMockData: Constants.expoConfig?.extra?.useMockData !== false,
};
