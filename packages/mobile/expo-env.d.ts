/// <reference types="expo-env" />

declare global {
  namespace Expo {
    interface Config {
      extra?: {
        eas?: {
          projectId?: string;
        };
      };
    }
  }
}

export {};