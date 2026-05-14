import { z } from 'astro/zod'

export const ogStyleChoices = z
  .enum(['default', 'default-dark', 'particle'])
  .optional()
  .default('default')
