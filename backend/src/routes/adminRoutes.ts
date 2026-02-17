import { Router } from 'express';
import { adminLogin, adminResetPassword, auditLogs, banUser, deleteEventAdmin, kpis, roleUser, users } from '../controllers/adminController';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { adminLoginSchema, banSchema, roleSchema } from '../schemas/admin';

const router = Router();
router.post('/login', validate(adminLoginSchema), adminLogin);
router.use(requireAuth, requireAdmin);
router.get('/users', users);
router.patch('/users/:id/ban', validate(banSchema), banUser);
router.patch('/users/:id/role', validate(roleSchema), roleUser);
router.patch('/users/:id/reset-password', adminResetPassword);
router.get('/audit-logs', auditLogs);
router.delete('/events/:id', deleteEventAdmin);
router.get('/kpis', kpis);

export default router;
