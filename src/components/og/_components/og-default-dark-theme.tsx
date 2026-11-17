import React from 'react'
import { OgCard, type OgThemeProps } from './og-card'
import { darkPalette } from './og-palettes'

/** `default-dark`: the card in the site's dark colours. */
export function OgDefaultDarkTheme(props: OgThemeProps) {
  return <OgCard {...props} palette={darkPalette} />
}
