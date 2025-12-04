import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupDatabase } from './database';
import { startDataSync } from './services/dataSync';
import fundsRouter from './routes/funds';
import portfolioRouter from './routes/portfolio';
import favoritesRouter from './routes/favorites';
import liveRouter from './routes/live';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/funds', fundsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/live', liveRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

async function start() {
  try {
    await setupDatabase();
    console.log('✅ Database initialized');

    startDataSync();
    console.log('✅ Data sync started');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
