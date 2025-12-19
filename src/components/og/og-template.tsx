import React from 'react'

const TITLE_FONT_THRESHOULD = 100
const TITLE_TRUNCATION_LENGTH = 150
const DESCRIPTION_TRUNCATION_LENGTH = 200

interface OgTemplateProps {
  title: string
  description: string
}

function getTitleFontSizePx(title: string): number {
  return title.length > TITLE_FONT_THRESHOULD ? 40 : 54
}

function truncateTitle(title: string): string {
  return title.length > TITLE_TRUNCATION_LENGTH
    ? title.slice(0, TITLE_TRUNCATION_LENGTH) + '...'
    : title
}

function truncateDescription(description: string): string {
  return description.length > DESCRIPTION_TRUNCATION_LENGTH
    ? description.slice(0, DESCRIPTION_TRUNCATION_LENGTH) + '...'
    : description
}

function getDescriptionFontSizePx(titleSizePx: number): number {
  return titleSizePx / 1.618
}

export function OgTemplateReact({ title, description }: OgTemplateProps) {
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
        backgroundColor: '#f7f8f9',
        color: '#383838',
        border: '1rem solid #383838',
        padding: '80px',
      }}
    >
      {/* logo */}
      <div style={{ marginBottom: '32px', display: 'flex' }}>
        <span
          style={{
            fontFamily: fontFamily,
            fontSize: '32px',
            fontWeight: 400,
            lineHeight: 1,
            display: 'flex',
            userSelect: 'none',
          }}
        >
          ALTR
        </span>
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
        style={{ height: '4px', backgroundColor: '#383838', margin: '16px 0' }}
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
