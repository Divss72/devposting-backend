import mongoose from 'mongoose';
import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';
  const isHealthy = mongoose.connection.readyState === 1;

  const mem = process.memoryUsage();

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    database: dbState,
    uptime: `${Math.floor(process.uptime())}s`,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
    },
  });
});

export default router;
