import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config';
import healthRoutes from './routes/health.routes';
import facilitiesRoutes from './routes/facilities.routes';
import onboardingRoutes from './routes/onboarding.routes';
import seedRoutes from './routes/seed.routes';
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
  app.use('/api/facilities', facilitiesRoutes);
  app.use('/api/onboarding', onboardingRoutes);

  // Dev-only seed route
  if (!config.isProduction) {
    app.use('/api/seed', seedRoutes);
  }

  // 404 & Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
