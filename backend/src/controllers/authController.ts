import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { compareHash, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/auth';

export async function register(req: Request, res: Response) {
  if (!env.registrationEnabled) return res.status(403).json({ error: { message: 'Registration is currently disabled.' } });
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash } });
  res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.banned || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: { message: 'Invalid credentials or account banned.' } });
  }
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await hashToken(refreshToken),
      expiresAt: new Date(Date.now() + env.refreshDays * 86400000)
    }
  });
  res.json({ accessToken, refreshToken });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const payload = verifyRefreshToken(refreshToken);
  const rows = await prisma.refreshToken.findMany({ where: { userId: payload.sub, revoked: false } });
  const row = await (async () => {
    for (const rt of rows) {
      if (await compareHash(refreshToken, rt.tokenHash)) return rt;
    }
    return null;
  })();
  if (!row) return res.status(401).json({ error: { message: 'Invalid refresh token.' } });
  const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
  const accessToken = signAccessToken(user.id, user.role);
  res.json({ accessToken });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const payload = verifyRefreshToken(refreshToken);
  const rows = await prisma.refreshToken.findMany({ where: { userId: payload.sub, revoked: false } });
  for (const rt of rows) {
    if (await compareHash(refreshToken, rt.tokenHash)) {
      await prisma.refreshToken.update({ where: { id: rt.id }, data: { revoked: true } });
    }
  }
  res.json({ ok: true });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = Math.random().toString(36).slice(2);
    await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExp: new Date(Date.now() + 3600000) } });
  }
  res.json({ message: 'If the email exists, reset instructions were sent.' });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;
  const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExp: { gt: new Date() } } });
  if (!user) return res.status(400).json({ error: { message: 'Invalid or expired reset token.' } });
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 10), resetToken: null, resetTokenExp: null }
  });
  res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: (req as any).user.sub } });
  if (!user) return res.status(404).json({ error: { message: 'User not found.' } });
  res.json({ id: user.id, email: user.email, role: user.role, banned: user.banned });
}
