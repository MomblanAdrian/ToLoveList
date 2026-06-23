import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import type { Express } from 'express';

export function setupSecurity(app: Express): void {
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(cookieParser());
}
