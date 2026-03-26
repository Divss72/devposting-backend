import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150),
    content: z.string().min(20),
    excerpt: z.string().max(300).optional().default(''),
    tags: z.array(z.string().min(1).max(30)).optional().default([]),
    category: z.string().max(50).optional().default('general'),
    status: z.enum(['draft', 'published']).optional().default('draft'),
    postType: z.enum(['blog', 'project']).optional().default('blog'),
    project: z
      .object({
        techStack: z.array(z.string().min(1).max(30)).optional().default([]),
        demoLink: z.string().url().optional().or(z.literal('')).default(''),
        githubLink: z.string().url().optional().or(z.literal('')).default(''),
      })
      .optional()
      .default({ techStack: [], demoLink: '', githubLink: '' }),
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
});

export const updatePostSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(150).optional(),
      content: z.string().min(20).optional(),
      excerpt: z.string().max(300).optional(),
      tags: z.array(z.string().min(1).max(30)).optional(),
      category: z.string().max(50).optional(),
      status: z.enum(['draft', 'published']).optional(),
      postType: z.enum(['blog', 'project']).optional(),
      project: z
        .object({
          techStack: z.array(z.string().min(1).max(30)).optional(),
          demoLink: z.string().url().optional().or(z.literal('')),
          githubLink: z.string().url().optional().or(z.literal('')),
        })
        .optional(),
    })
    .refine((v) => Object.keys(v).length > 0, 'At least one field is required'),
  params: z.object({ id: objectId }),
  query: z.object({}).optional().default({}),
});

export const postIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({ id: objectId }),
  query: z.object({}).optional().default({}),
});

export const postSlugSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({ slug: z.string() }),
  query: z.object({}).optional().default({}),
});

export const userIdSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({ userId: objectId }),
  query: z.object({}).optional().default({}),
});

export const listPostsSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    status: z.enum(['draft', 'published']).optional(),
    tag: z.string().optional(),
    category: z.string().optional(),
    postType: z.enum(['blog', 'project']).optional(),
  }),
});
