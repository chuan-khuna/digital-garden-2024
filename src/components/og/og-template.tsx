import React from 'react'
import type { OgStyle } from '@/content/collection-definitions/common-fields/_og-styles'
import type { OgThemeProps } from './_components/og-card'
import { OgDefaultTheme } from './_components/og-default-theme'
import { OgDefaultDarkTheme } from './_components/og-default-dark-theme'
import { OgParticleTheme } from './_components/og-particle-theme'

interface OgTemplateProps extends OgThemeProps {
  style: OgStyle
}

// One theme per OG style; adding a style to the enum without a theme here fails typecheck.
const themeComponents: Record<
  OgStyle,
  (props: OgThemeProps) => React.ReactElement
> = {
  default: OgDefaultTheme,
  'default-dark': OgDefaultDarkTheme,
  particle: OgParticleTheme,
}

export function OgImageTemplate({ style, ...props }: OgTemplateProps) {
  const SelectedTheme = themeComponents[style]
  return <SelectedTheme {...props} />
}
