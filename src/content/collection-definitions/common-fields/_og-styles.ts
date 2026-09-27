import { z } from 'astro/zod'

// Every OG image style. Each one needs a theme in src/components/og/og-template.tsx,
// which is typed `Record<OgStyle, …>` so a missing theme fails typecheck.
export const ogStyles = z.enum(['default', 'default-dark', 'particle'])

export type OgStyle = z.infer<typeof ogStyles>

export const ogStyleChoices = ogStyles.optional().default('default')
