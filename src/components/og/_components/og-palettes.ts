import { oklch } from '@/lib/og-image/color'

/** Colours of one OG card. Values mirror the site presets in src/styles/presets/. */
export interface OgPalette {
  background: string
  title: string
  text: string
  muted: string
  accent: string
  logo: string
}

// nzk preset (the site's default light theme)
export const lightPalette: OgPalette = {
  background: oklch(0.977, 0.0085, 84.57), // --background
  title: oklch(0.3261, 0.0984, 268.87), // --primary
  text: oklch(0.2699, 0.0096, 235.05, 0.8), // --theme-text
  muted: oklch(0.5544, 0.0431, 185.69), // --theme-link
  accent: oklch(0.713, 0.1834, 36.43), // --theme-accent
  logo: oklch(0.3261, 0.0984, 268.87), // --primary
}

// dark preset
export const darkPalette: OgPalette = {
  background: oklch(0.0791, 0.0178, 254.43), // --background
  title: oklch(0.9838, 0.0035, 247.86), // --primary
  text: oklch(0.8354, 0.0032, 264.54, 0.85), // --theme-text
  muted: oklch(0.8087, 0.1067, 222.35), // --theme-accent-2
  accent: oklch(0.7091, 0.1415, 163.79), // --theme-accent
  logo: oklch(0.9838, 0.0035, 247.86), // --primary
}
