import request from 'supertest';
import bcrypt from 'bcrypt';

jest.mock('../src/config/prisma', () => {
  const user = { id: 'u1', email: 'user@example.com', passwordHash: '$2b$10$abcdefghijklmnopqrstuv', role: 'USER', banned: false };
  const admin = { id: 'a1', email: 'admin@example.com', passwordHash: '$2b$10$abcdefghijklmnopqrstuv', role: 'ADMIN', banned: false };
  return {
    prisma: {
      user: {
        create: jest.fn(async ({ data }) => ({ id: 'u2', email: data.email })),
        findUnique: jest.fn(async ({ where }) => where.email === admin.email ? admin : (where.email === user.email ? user : null)),
        findUniqueOrThrow: jest.fn(async () => user),
        findFirst: jest.fn(async ({ where }) => where.resetToken ? user : user),
        update: jest.fn(async ({ where, data }) => ({ id: where.id, ...data })),
        findMany: jest.fn(async () => [user, admin]),
        count: jest.fn(async () => 2)
      },
      refreshToken: {
        create: jest.fn(async () => ({})),
        findMany: jest.fn(async () => [{ id: 'rt1', tokenHash: await bcrypt.hash('token', 1), revoked: false }]),
        update: jest.fn(async () => ({}))
      },
      event: {
        findMany: jest.fn(async () => []),
        create: jest.fn(async ({ data }) => ({ id: 'e1', ...data })),
        findFirst: jest.fn(async () => ({ id: 'e1', userId: 'u1', title: 'test', startAt: new Date('2026-01-01'), endAt: new Date('2026-01-01T01:00:00Z') })),
        update: jest.fn(async ({ data }) => ({ id: 'e1', ...data })),
        deleteMany: jest.fn(async () => ({})),
        delete: jest.fn(async () => ({})),
        count: jest.fn(async () => 1),
        groupBy: jest.fn(async () => [{ userId: 'u1' }])
      },
      eventRecurrence: {
        upsert: jest.fn(async ({ create }) => ({ id: 'r1', ...create }))
      },
      auditLog: {
        findMany: jest.fn(async () => []),
        create: jest.fn(async () => ({}))
      }
    }
  };
});

jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

import { app } from '../src/app';

describe('API smoke', () => {
  it('register', async () => { expect((await request(app).post('/auth/register').send({ email: 'x@y.com', password: 'Password1' })).status).toBe(201); });
  it('login', async () => { expect((await request(app).post('/auth/login').send({ email: 'user@example.com', password: 'Password1' })).status).toBe(200); });
  it('refresh', async () => { expect((await request(app).post('/auth/refresh').send({ refreshToken: 'token' })).status).toBe(200); });
  it('logout', async () => { expect((await request(app).post('/auth/logout').send({ refreshToken: 'token' })).status).toBe(200); });

  const auth = 'Bearer ' + require('jsonwebtoken').sign({ sub: 'u1', role: 'USER' }, 'access_secret');
  it('create event', async () => {
    const res = await request(app).post('/events').set('Authorization', auth).send({ title: 'A', startDateTime: '2026-01-01T00:00:00.000Z', endDateTime: '2026-01-01T01:00:00.000Z', allDay: false });
    expect(res.status).toBe(201);
  });
  it('update event', async () => { expect((await request(app).put('/events/e1').set('Authorization', auth).send({ title: 'B' })).status).toBe(200); });
  it('delete event', async () => { expect((await request(app).delete('/events/e1').set('Authorization', auth)).status).toBe(200); });
  it('out-of-range date fails', async () => {
    const res = await request(app).post('/events').set('Authorization', auth).send({ title: 'A', startDateTime: '1999-01-01T00:00:00.000Z', endDateTime: '1999-01-01T01:00:00.000Z', allDay: false });
    expect(res.status).toBe(400);
  });

  const adminAuth = 'Bearer ' + require('jsonwebtoken').sign({ sub: 'a1', role: 'ADMIN' }, 'access_secret');
  it('admin kpis', async () => { expect((await request(app).get('/admin/kpis').set('Authorization', adminAuth)).status).toBe(200); });
  it('admin ban', async () => { expect((await request(app).patch('/admin/users/u1/ban').set('Authorization', adminAuth).send({ banned: true })).status).toBe(200); });
  it('admin role', async () => { expect((await request(app).patch('/admin/users/u1/role').set('Authorization', adminAuth).send({ role: 'ADMIN' })).status).toBe(200); });
});
