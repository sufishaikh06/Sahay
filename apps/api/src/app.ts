import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config';
import healthRoutes from './routes/health.routes';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  // Basic Middleware
  app.use(cors({
    origin: config.corsOrigins,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);

  // 404 & Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
