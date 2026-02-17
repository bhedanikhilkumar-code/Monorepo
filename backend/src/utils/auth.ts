import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env';

export function signAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.accessSecret, { expiresIn: env.accessTTL });
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, env.refreshSecret, { expiresIn: `${env.refreshDays}d` });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.accessSecret) as { sub: string; role: 'USER' | 'ADMIN' };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.refreshSecret) as { sub: string };
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function compareHash(raw: string, hash: string) {
  return bcrypt.compare(raw, hash);
}
