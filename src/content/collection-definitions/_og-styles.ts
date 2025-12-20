import { z } from 'astro:content'

export const ogStyleChoices = z
  .enum(['default', 'default-dark'])
  .optional()
  .default('default')
