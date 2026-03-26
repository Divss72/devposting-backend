import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createCommentSchema = z.object({
  body: z.object({
    postId: objectId,
    content: z.string().min(1).max(1000),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

export const postCommentsSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    postId: objectId,
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  }),
});

export const likeSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    postId: objectId,
  }),
  query: z.object({}).optional().default({}),
});
