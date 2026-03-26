import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    bio: z.string().max(280).optional().default(''),
    avatar: z.string().url().optional().or(z.literal('')).default(''),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});
