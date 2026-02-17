import { z } from 'zod';

export const dateSchema = z.string().datetime();
export const emailSchema = z.string().email();
