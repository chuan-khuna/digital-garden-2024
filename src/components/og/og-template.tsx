import React from 'react'

interface OgTemplateProps {
  title: string
  description: string
}

export function OgTemplateReact({ title, description }: OgTemplateProps) {
  return (
    <div className="flex h-[630px] max-h-[630px] w-[1200px] max-w-[1200px] border-[1rem] border-[hsl(var(--foreground))] bg-[hsl(var(--background))] font-mono text-[hsl(var(--foreground))]">
      <div className="flex flex-col justify-center p-[5rem]">
        <div className="my-4">
          <span
            className="font-montez inline-block select-none"
            style={{ fontSize: '2.5rem', fontWeight: 400, lineHeight: 1 }}
          >
            altr
          </span>
        </div>

        <h1 className="max-w-[30ch] text-[4rem] leading-none">{title}</h1>
        <h2>{description}</h2>
      </div>
    </div>
  )
}
