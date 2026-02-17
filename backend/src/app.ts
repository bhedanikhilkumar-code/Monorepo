import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import { requireAuth } from './middleware/auth';
import { me } from './controllers/authController';
import eventRoutes from './routes/eventRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

export const app = express();
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.get('/me', requireAuth, me);
app.use('/events', eventRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);
