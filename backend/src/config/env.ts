import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  dbUrl: process.env.DATABASE_URL || '',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  accessTTL: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  registrationEnabled: process.env.REGISTRATION_ENABLED !== 'false',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 5)
};
