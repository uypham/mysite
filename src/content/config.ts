import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    lang: z.enum(["vi", "en"]),
  }),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = {
  blog,
};
