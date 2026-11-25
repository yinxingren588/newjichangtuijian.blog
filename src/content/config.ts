import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('2027机场评测小组'),
    tags: z.array(z.string()).default(['2027机场推荐']),
    featured: z.boolean().default(false),
    rating: z.number().min(1).max(5).optional(),
    keywords: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
