import { z } from 'zod';

const reminderSchema = z.object({ minutesBefore: z.number().int().optional(), customOffsetMin: z.number().int().optional() });

export const eventBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  color: z.string().optional(),
  categoryId: z.string().optional(),
  reminders: z.array(reminderSchema).optional(),
  attendees: z.array(z.string().email()).optional()
});

export const createEventSchema = z.object({ body: eventBodySchema });
export const updateEventSchema = z.object({ body: eventBodySchema.partial(), params: z.object({ id: z.string() }) });

export const listEventsSchema = z.object({
  query: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
    q: z.string().optional(),
    category: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional()
  })
});

export const idParamSchema = z.object({ params: z.object({ id: z.string() }) });

export const recurrenceSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    freq: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    interval: z.number().int().min(1).default(1),
    byWeekday: z.string().optional(),
    byMonthday: z.number().int().optional(),
    count: z.number().int().optional(),
    until: z.string().datetime().optional()
  })
});

export const occurrencesSchema = z.object({
  params: z.object({ id: z.string() }),
  query: z.object({ from: z.string().datetime(), to: z.string().datetime() })
});
