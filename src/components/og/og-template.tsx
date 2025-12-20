import React from 'react'
import { OgDefaultTheme } from './_components/og-default-theme'

interface OgTemplateProps {
  title: string
  description: string
}

export function OgTemplateReact({ title, description }: OgTemplateProps) {
  return <OgDefaultTheme title={title} description={description} />
}