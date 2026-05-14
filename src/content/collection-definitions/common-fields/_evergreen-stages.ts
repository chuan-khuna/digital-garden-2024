import { z } from 'astro/zod'

export const evergreenStages = z
  .enum(['seedling', 'budding', 'evergreen'])
  .optional()
