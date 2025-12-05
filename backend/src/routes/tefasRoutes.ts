import { Router } from 'express';
import { TefasService, RefreshWindow } from '../tefas/service';
import { TefasScheduler } from '../scheduler/TefasScheduler';

interface ManualSyncRequestBody {
  window?: RefreshWindow;
}

export const createTefasRouter = (service: TefasService, scheduler: TefasScheduler): Router => {
  const router = Router();

  router.get('/funds', async (_req, res) => {
    try {
      const funds = await service.listPersistedFunds();
      res.json({ funds });
    } catch (error) {
      console.error('Failed to list funds:', error);
      res.status(500).json({ error: 'Failed to list funds' });
    }
  });

  router.post('/sync', async (req, res) => {
    const body = req.body as ManualSyncRequestBody;
    const window = body.window || 'all';

    try {
      const result = await service.syncFunds(window);
      console.log(`Manual sync requested. Window: ${window}, Source: ${result.source}, Funds: ${result.fundsSynced}`);
      res.json({
        message: 'Manual sync completed',
        window,
        source: result.source,
        fundsSynced: result.fundsSynced,
      });
    } catch (error) {
      console.error('Manual sync failed:', error);
      res.status(500).json({ error: 'Manual sync failed' });
    }
  });

  router.post('/scheduler/run', async (req, res) => {
    const body = req.body as ManualSyncRequestBody;
    const window = body.window || 'all';

    try {
      await scheduler.manualSync(window);
      res.json({ message: 'Scheduled sync executed manually', window });
    } catch (error) {
      console.error('Scheduler manual sync failed:', error);
      res.status(500).json({ error: 'Scheduler manual sync failed' });
    }
  });

  router.delete('/cache', async (_req, res) => {
    try {
      await service.clear();
      res.json({ message: 'In-memory cache cleared' });
    } catch (error) {
      console.error('Failed to clear cache:', error);
      res.status(500).json({ error: 'Failed to clear cache' });
    }
  });

  return router;
};
