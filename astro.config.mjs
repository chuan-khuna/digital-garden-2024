import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
// import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkObsidianCallout from "remark-obsidian-callout";
import wikiLinkPlugin from 'remark-wiki-link'

import tailwindcss from '@tailwindcss/vite'

import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  site: process.env.CI
    ? 'https://altrf.dev/'
    : 'http://localhost:4321',

  markdown: {
    syntaxHighlight: 'shiki',
    gfm: true,
    remarkPlugins: [
      remarkMath,
      remarkFlexibleMarkers,
      remarkObsidianCallout,
      [
        wikiLinkPlugin,
        {
          hrefTemplate: (permalink) => `/posts/${permalink}`,
        },
      ],
    ],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Katex plugin options
        },
      ],
    ],
  },

  integrations: [
    react(),
    // tailwind({
    //   applyBaseStyles: false,
    // }),
    mdx(),
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({ imageService: 'compile' }),
})
