import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDB();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
