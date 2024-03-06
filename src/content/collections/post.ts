
import { z, defineCollection } from "astro:content";

export const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      date: z.string(),
      aliases: z.array(z.string()),
      tags: z.array(z.string())
    })
});