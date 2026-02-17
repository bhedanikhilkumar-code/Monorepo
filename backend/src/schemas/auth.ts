import { z } from 'zod';
import { emailSchema } from './common';

export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(8)
  })
});

export const loginSchema = registerSchema;

export const forgotSchema = z.object({ body: z.object({ email: emailSchema }) });
export const resetSchema = z.object({ body: z.object({ token: z.string(), password: z.string().min(8) }) });
