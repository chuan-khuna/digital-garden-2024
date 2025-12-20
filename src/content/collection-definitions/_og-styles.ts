import { z } from 'astro:content'

export const ogStyleChoices = z
  .enum(['default', 'default-dark', 'particle'])
  .optional()
  .default('default')
