import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { logAdminAction } from '../services/auditService';
import { signAccessToken, signRefreshToken } from '../utils/auth';

export async function adminLogin(req: Request, res: Response) {
  const { email, password } = req.body;
  const admin = await prisma.user.findUnique({ where: { email } });
  if (!admin || admin.role !== 'ADMIN' || !(await bcrypt.compare(password, admin.passwordHash))) {
    return res.status(401).json({ error: { message: 'Invalid admin credentials.' } });
  }
  res.json({ accessToken: signAccessToken(admin.id, admin.role), refreshToken: signRefreshToken(admin.id) });
}

export async function users(req: Request, res: Response) {
  const q = (req.query.q as string) || '';
  const users = await prisma.user.findMany({ where: { email: { contains: q, mode: 'insensitive' } }, orderBy: { createdAt: 'desc' } });
  res.json(users);
}

export async function banUser(req: Request, res: Response) {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { banned: req.body.banned } });
  await logAdminAction((req as any).user.sub, 'USER_BAN_TOGGLE', 'USER', user.id, req.ip, { banned: user.banned });
  res.json(user);
}

export async function roleUser(req: Request, res: Response) {
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role: req.body.role } });
  await logAdminAction((req as any).user.sub, 'USER_ROLE_CHANGE', 'USER', user.id, req.ip, { role: user.role });
  res.json(user);
}

export async function auditLogs(_req: Request, res: Response) {
  res.json(await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }));
}

export async function deleteEventAdmin(req: Request, res: Response) {
  await prisma.event.delete({ where: { id: req.params.id } });
  await logAdminAction((req as any).user.sub, 'DELETE_EVENT', 'EVENT', req.params.id, req.ip);
  res.json({ ok: true });
}

export async function kpis(_req: Request, res: Response) {
  const totalUsers = await prisma.user.count();
  const activeUsers = await prisma.event.groupBy({ by: ['userId'], where: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } });
  const eventsDaily = await prisma.event.count({ where: { createdAt: { gte: new Date(Date.now() - 86400000) } } });
  const eventsWeekly = await prisma.event.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } });
  res.json({ totalUsers, activeUsers: activeUsers.length, eventsDaily, eventsWeekly });
}

export async function adminResetPassword(req: Request, res: Response) {
  const tempPassword = req.body.password || 'Temp@12345';
  const hash = await bcrypt.hash(tempPassword, 10);
  await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash: hash } });
  await logAdminAction((req as any).user.sub, 'ADMIN_PASSWORD_RESET', 'USER', req.params.id, req.ip);
  res.json({ ok: true });
}
