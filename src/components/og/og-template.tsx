import React from 'react'
import { OgDefaultTheme } from './_components/og-default-theme'
import { OgDefaultDarkTheme } from './_components/og-default-dark-theme'

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
  const themeComponents = {
    default: OgDefaultTheme,
    'default-dark': OgDefaultDarkTheme,
  };
  
  const SelectedTheme = themeComponents[style as keyof typeof themeComponents] || OgDefaultTheme;
  
  return <SelectedTheme title={title} description={description} />;
}
