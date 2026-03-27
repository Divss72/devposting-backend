import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDB();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  // Graceful shutdown for Railway deploys and local Ctrl+C
  const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      mongoose.connection.close(false).then(() => {
        // eslint-disable-next-line no-console
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });

    // Force exit after 10s if graceful shutdown fails
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
