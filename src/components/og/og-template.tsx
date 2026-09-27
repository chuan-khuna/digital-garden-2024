import React from 'react'
import type { OgStyle } from '@/content/collection-definitions/common-fields/_og-styles'
import { OgDefaultTheme } from './_components/og-default-theme'
import { OgDefaultDarkTheme } from './_components/og-default-dark-theme'
import { OgParticleTheme } from './_components/og-particle-theme'

interface OgTemplateProps {
  title: string
  description: string
  style: OgStyle
}

// One theme per OG style; adding a style to the enum without a theme here fails typecheck.
const themeComponents: Record<OgStyle, typeof OgDefaultTheme> = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}

export function OgImageTemplate({
  title,
  description,
  style,
}: OgTemplateProps) {
  const SelectedTheme = themeComponents[style]
  return <SelectedTheme title={title} description={description} />
}
