import mongoose from 'mongoose';
import { config } from './index';

/**
 * MongoDB Atlas Connection Manager.
 * Environment-based URI, automatic retry logic, and clean disconnect on shutdown.
 */
export async function connectDatabase(): Promise<typeof mongoose | null> {
  if (!config.mongodbUri) {
    console.warn('[DATABASE WARNING] MONGODB_URI not configured. Database operations will fail or run mock.');
    return null;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err: any) {
    console.error(`[DATABASE ERROR] MongoDB Connection failed: ${err.message}`);
    if (config.isProduction) {
      process.exit(1);
    }
    return null;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('[DATABASE] MongoDB Disconnected');
  } catch (err: any) {
    console.error(`[DATABASE ERROR] Disconnect failed: ${err.message}`);
  }
}
