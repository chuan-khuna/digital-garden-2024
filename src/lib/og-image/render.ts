/**
 * Renders an OG image (1200×630 PNG): React theme → satori (SVG) → sharp (PNG).
 * Runs at build time only (the OG routes are prerendered).
 */
import { OgImageTemplate } from '@/components/og/og-template'
import type { OgStyle } from '@/content/collection-definitions/common-fields/_og-styles'
import satori, { type SatoriOptions } from 'satori'
import sharp from 'sharp'
import fs from 'fs/promises'

// Paths are relative to the project root: `astro build` must run from there.
const [VictorMono, VictorMonoLight, VictorMonoBold] = await Promise.all([
  fs.readFile('./src/assets/fonts/VictorMono-Regular.ttf'),
  fs.readFile('./src/assets/fonts/VictorMono-Light.ttf'),
  fs.readFile('./src/assets/fonts/VictorMono-Bold.ttf'),
])

export async function renderOgImage(
  title: string,
  description: string,
  style: OgStyle,
): Promise<Buffer> {
  const satoriOption: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'VictorMono',
        data: VictorMono,
        weight: 400,
      },
      {
        name: 'VictorMono',
        data: VictorMonoLight,
        weight: 300,
      },
      {
        name: 'VictorMono',
        data: VictorMonoBold,
        weight: 700,
      },
    ],
  }

  const component = OgImageTemplate({ title, description, style })

  const svg = await satori(component, satoriOption)

  const image = sharp(Buffer.from(svg)).png({
    compressionLevel: 9, // Maximum compression level (0-9)
    adaptiveFiltering: true, // Optimize file size with adaptive filtering
    palette: true, // Convert to palette-based PNG (effective for fewer colors)
    quality: 80, // Image quality (0-100)
  })

  return await image.toBuffer()
}
