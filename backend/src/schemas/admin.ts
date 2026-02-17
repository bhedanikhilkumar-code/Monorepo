import { z } from 'zod';

export const adminLoginSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8) }) });
export const banSchema = z.object({ params: z.object({ id: z.string() }), body: z.object({ banned: z.boolean() }) });
export const roleSchema = z.object({ params: z.object({ id: z.string() }), body: z.object({ role: z.enum(['USER', 'ADMIN']) }) });
