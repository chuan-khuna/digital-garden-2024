import React from 'react'
import OGImageLogo from '@/components/og/_components/og-logo'
import type { OgPalette } from './og-palettes'
import { getTitleFontSizePx, truncateDescription, truncateTitle } from './utils'

export interface OgThemeProps {
  title: string
  description: string
  /** Kicker above the title, e.g. "Post", "Note", "Project". */
  label: string
  /** Shown in the footer, e.g. "altrf.dev". */
  siteHost: string
  siteTitle: string
}

interface OgCardProps extends OgThemeProps {
  palette: OgPalette
  /** Drawn behind the content (e.g. the particle network). */
  background?: React.ReactNode
}

const SERIF = 'DM Serif Text'
const SANS = 'Lato'
const MONO = 'VictorMono'

/**
 * The shared OG card layout (1200×630). Satori only supports inline styles and
 * flexbox, so every element sets `display: flex` explicitly.
 */
export function OgCard({
  title,
  description,
  label,
  siteHost,
  siteTitle,
  palette,
  background,
}: OgCardProps) {
  const formattedTitle = truncateTitle(title)
  const titleSize = getTitleFontSizePx(formattedTitle)
  const formattedDescription = truncateDescription(description)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: palette.background,
      }}
    >
      {background}

      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
        }}
      >
        {/* Header: kicker + site title */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                width: 8,
                height: 32,
                borderRadius: 2,
                backgroundColor: palette.accent,
                marginRight: 16,
              }}
            />
            <span style={{ color: palette.accent, fontWeight: 700 }}>
              {label}
            </span>
          </div>
          {/* The home page's title is the site title, so don't repeat it */}
          {siteTitle !== title && (
            <span style={{ color: palette.muted, fontWeight: 400 }}>
              {siteTitle}
            </span>
          )}
        </div>

        {/* Title + description */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: SERIF,
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              color: palette.title,
            }}
          >
            {formattedTitle}
          </div>
          {formattedDescription && (
            <div
              style={{
                display: 'flex',
                marginTop: 28,
                maxWidth: 960,
                fontFamily: SANS,
                fontSize: 30,
                lineHeight: 1.4,
                color: palette.text,
              }}
            >
              {formattedDescription}
            </div>
          )}
        </div>

        {/* Footer: accent rule, host, logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                width: 120,
                height: 6,
                borderRadius: 3,
                backgroundColor: palette.accent,
                marginBottom: 20,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 24,
                color: palette.muted,
              }}
            >
              {siteHost}
            </span>
          </div>
          <OGImageLogo fillColor={palette.logo} width={168} opacity={90} />
        </div>
      </div>
    </div>
  )
}
