import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/error.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import postRoutes from './routes/postRoutes.js';

// Custom sanitizer compatible with Express 5 (req.query is read-only)
function sanitizeValue(val) {
  if (typeof val === 'string') {
    return val.replace(/[${}]/g, '');
  }
  if (val && typeof val === 'object') {
    for (const key of Object.keys(val)) {
      if (key.startsWith('$')) {
        delete val[key];
      } else {
        val[key] = sanitizeValue(val[key]);
      }
    }
  }
  return val;
}

function sanitize(req, _res, next) {
  if (req.body) sanitizeValue(req.body);
  if (req.params) sanitizeValue(req.params);
  next();
}

const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.clientUrl === '*' ? true : env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 600 }));

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
