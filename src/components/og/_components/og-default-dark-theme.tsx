import React from 'react'
import OGImageLogo from '@/components/og/_components/og-logo'
import {
  truncateTitle,
  truncateDescription,
  getTitleFontSizePx,
  getDescriptionFontSizePx,
} from './utils'

interface OgTemplateProps {
  title: string
  description: string
}

export function OgDefaultDarkTheme({ title, description }: OgTemplateProps) {
  const fontFamily = 'VictorMono, monospace'

  const formattedTitle = truncateTitle(title)
  const titleSize = getTitleFontSizePx(formattedTitle)

  const formattedDescription = truncateDescription(description)
  const descriptionSize = getDescriptionFontSizePx(titleSize)

  // Use inline styles instead of Tailwind classes for Satori compatibility
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: fontFamily,
        backgroundColor: '#1a1a1a',
        color: '#e0e0e0',
        border: '1rem solid #e0e0e0',
        padding: '80px',
      }}
    >
      {/* logo */}
      <div
        style={{
          padding: '0px',
          display: 'flex',
          position: 'absolute',
          bottom: '0px',
          right: '0px',
        }}
      >
        <OGImageLogo />
      </div>

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
        style={{ height: '4px', backgroundColor: '#e0e0e0', margin: '16px 0' }}
      />

      <h2
        style={{
          fontSize: `${descriptionSize}px`,
          fontWeight: 400,
          lineHeight: 1.2,
        }}
      >
        {formattedDescription}
      </h2>
    </div>
  )
}
