import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import env from '@fastify/env';
import dotenv from 'dotenv';

dotenv.config();

const schema = {
  type: 'object',
  required: ['PORT', 'NODE_ENV'],
  properties: {
    PORT: {
      type: 'string',
      default: '3001',
    },
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    CORS_ORIGIN: {
      type: 'string',
      default: 'http://localhost:3000',
    },
    TEFAS_API_BASE_URL: {
      type: 'string',
    },
    TEFAS_API_KEY: {
      type: 'string',
    },
    TEFAS_API_SECRET: {
      type: 'string',
    },
  },
};

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

await server.register(env, {
  schema,
  dotenv: true,
});

await server.register(helmet);
await server.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
});

server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

server.get('/api/tefas/funds', async (request, reply) => {
  try {
    const { TEFAS_API_BASE_URL, TEFAS_API_KEY, TEFAS_API_SECRET } = process.env;
    
    if (!TEFAS_API_BASE_URL || !TEFAS_API_KEY || !TEFAS_API_SECRET) {
      return reply.status(500).send({ 
        error: 'TEFAS configuration missing' 
      });
    }

    // TODO: Implement actual TEFAS API integration
    return { 
      message: 'TEFAS funds endpoint',
      data: [],
      config: {
        baseUrl: TEFAS_API_BASE_URL,
        hasCredentials: !!(TEFAS_API_KEY && TEFAS_API_SECRET),
      },
    };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    server.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();