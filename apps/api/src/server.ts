import { createApp } from './app';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './config/database';

async function startServer() {
  // Establish DB connection
  await connectDatabase();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`[API] Server running on port ${config.port} (${config.nodeEnv})`);
    console.log(`[API] Health check: http://localhost:${config.port}/api/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`[API] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('[API] Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[API FATAL]', err);
  process.exit(1);
});
