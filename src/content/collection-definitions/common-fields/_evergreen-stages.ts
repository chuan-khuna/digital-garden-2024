import { z } from 'astro:content'

export const evergreenStages = z
  .enum(['seedling', 'budding', 'evergreen'])
  .optional()
