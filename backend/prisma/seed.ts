import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('Admin@12345', 10);
  const userHash = await bcrypt.hash('User@12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', passwordHash: adminHash, role: 'ADMIN' }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { email: 'user@example.com', passwordHash: userHash, role: 'USER' }
  });

  const category = await prisma.category.create({ data: { userId: user.id, name: 'Work', color: '#2563eb' } });

  const event = await prisma.event.create({
    data: {
      userId: user.id,
      title: 'Demo recurring standup',
      startAt: new Date('2026-01-03T09:00:00.000Z'),
      endAt: new Date('2026-01-03T09:30:00.000Z'),
      location: 'Zoom',
      categoryId: category.id,
      recurrence: { create: { freq: 'WEEKLY', interval: 1, byWeekday: 'MO,TU,WE,TH,FR', until: new Date('2026-12-31T00:00:00.000Z') } },
      reminders: { create: [{ minutesBefore: 10 }] }
    }
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: 'SEED_CREATED_EVENT',
      targetType: 'EVENT',
      targetId: event.id,
      metadata: { seeded: true }
    }
  });
}

main().finally(() => prisma.$disconnect());
