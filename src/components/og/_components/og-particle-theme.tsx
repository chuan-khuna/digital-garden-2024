import React from 'react'
import OGParticle from '@/components/og/_components/og-particle'
import { oklch } from '@/lib/og-image/color'
import { OgCard, type OgThemeProps } from './og-card'
import { lightPalette } from './og-palettes'

// lightPalette.background at varying alpha, for the fade over the particles
const fade = (alpha: number) => oklch(0.977, 0.0085, 84.57, alpha)

/**
 * `particle`: the light card over a seeded particle network that fades out
 * towards the text on the left, so the title stays readable.
 */
export function OgParticleTheme(props: OgThemeProps) {
  // Same title → same pattern
  const seed = props.title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const background = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <OGParticle
        particleColor={lightPalette.accent}
        lineColor={lightPalette.title}
        particleCount={90}
        width={1200}
        height={630}
        seed={seed}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundImage: `linear-gradient(90deg, ${fade(1)} 0%, ${fade(0.92)} 45%, ${fade(0.55)} 75%, ${fade(0.25)} 100%)`,
        }}
      />
    </div>
  )

  return <OgCard {...props} palette={lightPalette} background={background} />
}
