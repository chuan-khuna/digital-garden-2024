import React from 'react'
import { OgDefaultTheme } from './_components/og-default-theme'

interface OgTemplateProps {
  title: string
  description: string
  style: string
}

export function OgImageTemplate({
  title,
  description,
  style,
}: OgTemplateProps) {
  if (style === 'default') {
    return <OgDefaultTheme title={title} description={description} />
  }

  return <OgDefaultTheme title={title} description={description} />
}
