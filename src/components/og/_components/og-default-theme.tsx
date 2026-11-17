import React from 'react'
import { OgCard, type OgThemeProps } from './og-card'
import { lightPalette } from './og-palettes'

/** `default`: the card in the site's light (nzk) colours. */
export function OgDefaultTheme(props: OgThemeProps) {
  return <OgCard {...props} palette={lightPalette} />
}
