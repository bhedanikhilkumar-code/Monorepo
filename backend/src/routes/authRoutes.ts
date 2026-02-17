import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { forgotPassword, login, logout, me, refresh, register, resetPassword } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { forgotSchema, loginSchema, registerSchema, resetSchema } from '../schemas/auth';

const router = Router();
const limiter = rateLimit({ windowMs: 60000, limit: 10 });

router.post('/register', validate(registerSchema), register);
router.post('/login', limiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', validate(forgotSchema), forgotPassword);
router.post('/reset-password', validate(resetSchema), resetPassword);
router.get('/me', requireAuth, me);

export default router;
