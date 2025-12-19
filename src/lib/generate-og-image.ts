import { OgTemplateReact } from '@/components/og/og-template'
import satori, { type SatoriOptions } from 'satori'
import sharp from 'sharp'
import fs from 'fs/promises'

async function getFontData(url: string) {
  const fontResponse = await fetch(url)
  return await fontResponse.arrayBuffer()
}

async function getFontDataFromFile(path: string) {
  return await fs.readFile(path)
}

const [VictorMono] = await Promise.all([
  getFontDataFromFile('./src/assets/fonts/VictorMono-Regular.woff'),
])

export async function generateOgImage(title: string, description: string) {
  console.log('Generating OG image...')
  console.log('Title:', title)
  console.log('Description:', description)
  const satoriOption: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'VictorMono',
        data: VictorMono,
        weight: 400,
      },
    ],
  }

  const component = OgTemplateReact({ title, description })

  const svg = await satori(component, satoriOption)

  const image = sharp(Buffer.from(svg)).png({
    compressionLevel: 9, // Maximum compression level (0-9)
    adaptiveFiltering: true, // Optimize file size with adaptive filtering
    palette: true, // Convert to palette-based PNG (effective for fewer colors)
    quality: 80, // Image quality (0-100)
  })

  return await image.toBuffer()
}
