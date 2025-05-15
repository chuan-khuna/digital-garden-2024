import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
// import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import wikiLinkPlugin from 'remark-wiki-link'

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.CI
    ? 'https://github.com/chuan-khuna'
    : 'http://localhost:4321',

  markdown: {
    syntaxHighlight: 'shiki',
    gfm: true,
    remarkPlugins: [
      remarkMath,
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
})