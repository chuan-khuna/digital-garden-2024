import React from 'react'

interface OgTemplateProps {
  title: string
  description: string
  theme?: 'light' | 'dark'
}

export function OgTemplateReact({
  title,
  description,
  theme = 'light',
}: OgTemplateProps) {
  // Use inline styles instead of Tailwind classes for Satori compatibility
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Inconsolata, monospace',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f7f8f9',
        color: theme === 'dark' ? '#e0e0e0' : '#383838',
        border: `64px solid ${theme === 'dark' ? '#e0e0e0' : '#383838'}`,
        padding: '80px',
      }}
    >
      <div style={{ marginBottom: '32px', display: 'flex' }}>
        <span
          style={{
            fontFamily: 'Montez, cursive',
            fontSize: '40px',
            fontWeight: 400,
            lineHeight: 1,
            display: 'flex',
            userSelect: 'none',
          }}
        >
          altr
        </span>
      </div>

      <h1
        style={{
          fontSize: '64px',
          fontWeight: 400,
          lineHeight: 1,
          maxWidth: '30ch',
          marginBottom: '16px',
        }}
      >
        {title}
      </h1>

      <h2
        style={{
          fontSize: '32px',
          fontWeight: 400,
          lineHeight: 1.2,
        }}
      >
        {description}
      </h2>
    </div>
  )
}
