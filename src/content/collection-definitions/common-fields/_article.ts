import { z } from 'astro:content'
import { evergreenStages } from './_evergreen-stages'
import { ogStyleChoices } from './_og-styles'

export const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  // created date
  date: z.string().optional(),
  // updated date
  updated: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  stage: evergreenStages,
  ogStyle: ogStyleChoices,
})
