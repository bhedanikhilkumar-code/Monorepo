import { prisma } from '../config/prisma';

export async function logAdminAction(adminId: string, action: string, targetType: string, targetId?: string, ip?: string, metadata?: unknown) {
  return prisma.auditLog.create({ data: { adminId, action, targetType, targetId, ip, metadata: metadata as any } });
}
