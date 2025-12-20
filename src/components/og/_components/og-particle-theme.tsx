import React from 'react'
import OGImageLogo from '@/components/og/_components/og-logo'
import OGParticle from '@/components/og/_components/og-particle'
import {
  truncateTitle,
  truncateDescription,
  getTitleFontSizePx,
  getDescriptionFontSizePx,
} from './utils'

interface OgParticleThemeProps {
  title: string
  description: string
}

export function OgParticleTheme({ title, description }: OgParticleThemeProps) {
  const fontFamily = 'VictorMono, monospace'

  const formattedTitle = truncateTitle(title)
  const titleSize = getTitleFontSizePx(formattedTitle)

  const formattedDescription = truncateDescription(description)
  const descriptionSize = getDescriptionFontSizePx(titleSize)

  // Generate a seed from the title for consistent particle patterns per page
  const seed = title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Particle network background - absolutely positioned */}
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
          particleColor="#383838"
          lineColor="#383838"
          particleCount={80}
          width={1200}
          height={630}
          seed={seed}
        />
      </div>

      {/* Content container with semi-transparent background */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#f7f8f9c0',
          width: '100%',
          height: '100%',
          fontFamily: fontFamily,
          color: '#383838',
          opacity: 0.8,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            {formattedTitle}
          </h1>

          <div
            style={{
              height: '4px',
              backgroundColor: '#383838',
              margin: '16px 0',
              width: '100%',
              // opacity: 0.8,
              display: 'flex',
            }}
          />

          <h2
            style={{
              fontSize: `${descriptionSize}px`,
              fontWeight: 400,
              lineHeight: 1.2,
              // opacity: 0.9,
            }}
          >
            {formattedDescription}
          </h2>
        </div>

        {/* Logo */}
        <div
          style={{
            padding: '0px',
            display: 'flex',
            position: 'absolute',
            bottom: '80px',
            right: '80px',
          }}
        >
          <OGImageLogo fillColor="#383838" opacity={60} width={240} />
        </div>
      </div>
    </div>
  )
}
