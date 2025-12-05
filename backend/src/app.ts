import express from 'express';
import { createTefasRouter } from './routes/tefasRoutes';
import { TefasService } from './tefas/service';
import { TefasScheduler } from './scheduler/TefasScheduler';

export const createApp = (service: TefasService, scheduler: TefasScheduler) => {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/tefas', createTefasRouter(service, scheduler));

  return app;
};
