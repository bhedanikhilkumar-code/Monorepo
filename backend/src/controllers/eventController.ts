import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { assertDateInRange } from '../utils/dateRange';
import { buildRRule } from '../services/recurrenceService';
import { generateICS, parseSimpleICS } from '../services/icsService';

export async function listEvents(req: Request, res: Response) {
  const { from, to, q, category, page = '1', limit = '20' } = req.query as any;
  const fromDate = new Date(from); const toDate = new Date(to);
  assertDateInRange(fromDate, 'from'); assertDateInRange(toDate, 'to');
  const where: any = { userId: (req as any).user.sub, startAt: { gte: fromDate }, endAt: { lte: toDate } };
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }, { location: { contains: q, mode: 'insensitive' } }];
  if (category) where.categoryId = category;
  const data = await prisma.event.findMany({ where, skip: (Number(page)-1)*Number(limit), take: Number(limit), include: { recurrence: true, reminders: true } });
  res.json(data);
}

export async function createEvent(req: Request, res: Response) {
  const body = req.body;
  const startAt = new Date(body.startDateTime); const endAt = new Date(body.endDateTime);
  assertDateInRange(startAt, 'startDateTime'); assertDateInRange(endAt, 'endDateTime');
  if (endAt <= startAt) throw new Error('End date must be after start date.');
  const event = await prisma.event.create({
    data: {
      userId: (req as any).user.sub,
      title: body.title,
      description: body.description,
      startAt,
      endAt,
      allDay: body.allDay,
      location: body.location,
      color: body.color,
      categoryId: body.categoryId,
      reminders: body.reminders ? { create: body.reminders } : undefined
    }, include: { reminders: true }
  });
  res.status(201).json(event);
}

export async function getEvent(req: Request, res: Response) {
  const event = await prisma.event.findFirst({ where: { id: req.params.id, userId: (req as any).user.sub }, include: { reminders: true, recurrence: true } });
  if (!event) return res.status(404).json({ error: { message: 'Event not found.' } });
  res.json(event);
}

export async function updateEvent(req: Request, res: Response) {
  const current = await prisma.event.findFirst({ where: { id: req.params.id, userId: (req as any).user.sub } });
  if (!current) return res.status(404).json({ error: { message: 'Event not found.' } });
  const data: any = { ...req.body };
  if (data.startDateTime) { data.startAt = new Date(data.startDateTime); assertDateInRange(data.startAt, 'startDateTime'); }
  if (data.endDateTime) { data.endAt = new Date(data.endDateTime); assertDateInRange(data.endAt, 'endDateTime'); }
  delete data.startDateTime; delete data.endDateTime;
  const event = await prisma.event.update({ where: { id: current.id }, data });
  res.json(event);
}

export async function deleteEvent(req: Request, res: Response) {
  await prisma.event.deleteMany({ where: { id: req.params.id, userId: (req as any).user.sub } });
  res.json({ ok: true });
}

export async function setRecurrence(req: Request, res: Response) {
  if (req.body.until) assertDateInRange(new Date(req.body.until), 'recurrence until');
  const existing = await prisma.event.findFirst({ where: { id: req.params.id, userId: (req as any).user.sub } });
  if (!existing) return res.status(404).json({ error: { message: 'Event not found.' } });
  const recurrence = await prisma.eventRecurrence.upsert({
    where: { eventId: existing.id },
    create: { eventId: existing.id, ...req.body, until: req.body.until ? new Date(req.body.until) : undefined },
    update: { ...req.body, until: req.body.until ? new Date(req.body.until) : undefined }
  });
  res.json(recurrence);
}

export async function getOccurrences(req: Request, res: Response) {
  const event = await prisma.event.findFirst({ where: { id: req.params.id, userId: (req as any).user.sub }, include: { recurrence: true } });
  if (!event || !event.recurrence) return res.json([]);
  const from = new Date(req.query.from as string); const to = new Date(req.query.to as string);
  assertDateInRange(from, 'from'); assertDateInRange(to, 'to');
  const rule = buildRRule(event.startAt, event.recurrence);
  const occurrences = rule.between(from, to, true).map((start) => ({ start, end: new Date(start.getTime() + (event.endAt.getTime() - event.startAt.getTime())) }));
  res.json(occurrences);
}

export async function exportICS(req: Request, res: Response) {
  const from = new Date(req.query.from as string); const to = new Date(req.query.to as string);
  assertDateInRange(from, 'from'); assertDateInRange(to, 'to');
  const events = await prisma.event.findMany({ where: { userId: (req as any).user.sub, startAt: { gte: from }, endAt: { lte: to } } });
  const body = generateICS(events);
  res.header('Content-Type', 'text/calendar').send(body);
}

export async function importICS(req: Request, res: Response) {
  const raw = req.body.ics as string;
  const parsed = parseSimpleICS(raw);
  const created = [];
  for (const p of parsed) {
    const duplicate = await prisma.event.findFirst({ where: { userId: (req as any).user.sub, title: p.title, startAt: p.startAt } });
    if (duplicate) continue;
    created.push(await prisma.event.create({ data: { userId: (req as any).user.sub, title: p.title, startAt: p.startAt, endAt: p.endAt } }));
  }
  res.json({ created: created.length, skipped: parsed.length - created.length });
}
