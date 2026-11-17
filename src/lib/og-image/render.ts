/**
 * Renders an OG image (1200×630 PNG): React theme → satori (SVG) → sharp (PNG).
 * Runs at build time only (the OG routes are prerendered).
 */
import { OgImageTemplate } from '@/components/og/og-template'
import type { OgThemeProps } from '@/components/og/_components/og-card'
import type { OgStyle } from '@/content/collection-definitions/common-fields/_og-styles'
import satori, { type SatoriOptions } from 'satori'
import sharp from 'sharp'
import fs from 'fs/promises'

// Paths are relative to the project root: `astro build` must run from there.
// Serif title (DM Serif Text), sans description (Lato), mono kicker/footer (VictorMono).
const FONT_DIR = './src/assets/fonts'
const FONT_FILES: Array<{ name: string; file: string; weight: 400 | 700 }> = [
  { name: 'DM Serif Text', file: 'DMSerifText-Regular.ttf', weight: 400 },
  { name: 'Lato', file: 'Lato-Regular.ttf', weight: 400 },
  { name: 'Lato', file: 'Lato-Bold.ttf', weight: 700 },
  { name: 'VictorMono', file: 'VictorMono-Regular.ttf', weight: 400 },
  { name: 'VictorMono', file: 'VictorMono-Bold.ttf', weight: 700 },
]

const fonts: SatoriOptions['fonts'] = await Promise.all(
  FONT_FILES.map(async ({ name, file, weight }) => ({
    name,
    weight,
    style: 'normal' as const,
    data: await fs.readFile(`${FONT_DIR}/${file}`),
  })),
)

export interface RenderOgImageInput extends OgThemeProps {
  style: OgStyle
}

export async function renderOgImage(
  input: RenderOgImageInput,
): Promise<Buffer> {
  const satoriOption: SatoriOptions = { width: 1200, height: 630, fonts }

  const component = OgImageTemplate(input)

  const svg = await satori(component, satoriOption)

  const image = sharp(Buffer.from(svg)).png({
    compressionLevel: 9, // Maximum compression level (0-9)
    adaptiveFiltering: true, // Optimize file size with adaptive filtering
    palette: true, // Convert to palette-based PNG (effective for fewer colors)
    quality: 80, // Image quality (0-100)
  })

  return await image.toBuffer()
}
