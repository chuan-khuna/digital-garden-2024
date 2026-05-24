import { defineConfig, fontProviders } from 'astro/config'
import react from '@astrojs/react'
// import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkFlexibleMarkers from 'remark-flexible-markers'
import remarkObsidianCallout from 'remark-obsidian-callout'
import wikiLinkPlugin from 'remark-wiki-link'

import tailwindcss from '@tailwindcss/vite'

import cloudflare from '@astrojs/cloudflare'

import sitemap from '@astrojs/sitemap'

import expressiveCode from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

// https://astro.build/config
export default defineConfig({
  site: process.env.CI ? 'https://altrf.dev/' : 'http://localhost:4321',

  fonts: [
    // --- Body fonts ---
    {
      provider: fontProviders.google(),
      name: 'Lato',
      cssVariable: '--font-lato',
      weights: [100, 300, 400, 700, 900],
      styles: ['normal', 'italic'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Serif Text',
      cssVariable: '--font-dm-serif-text',
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'DM Serif Display',
      cssVariable: '--font-dm-serif-display',
      styles: ['normal', 'italic'],
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inconsolata',
      cssVariable: '--font-inconsolata',
      weights: ['200 900'],
      fallbacks: ['monospace'],
    },
    // --- Logo / decorative fonts ---
    {
      provider: fontProviders.google(),
      name: 'Liu Jian Mao Cao',
      cssVariable: '--font-liu-jian-mao-cao',
    },
    {
      provider: fontProviders.google(),
      name: 'Potta One',
      cssVariable: '--font-potta-one',
    },
    {
      provider: fontProviders.google(),
      name: 'Rampart One',
      cssVariable: '--font-rampart-one',
    },
    {
      provider: fontProviders.google(),
      name: 'Zhi Mang Xing',
      cssVariable: '--font-zhi-mang-xing',
    },
    {
      provider: fontProviders.google(),
      name: 'Lavishly Yours',
      cssVariable: '--font-lavishly-yours',
      fallbacks: ['cursive'],
    },
    {
      provider: fontProviders.google(),
      name: 'Montez',
      cssVariable: '--font-montez',
      fallbacks: ['cursive'],
    },
  ],

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
    sitemap(), // tailwind({
    react(), //   applyBaseStyles: false,
    // }),
    expressiveCode({
      themes: ['catppuccin-latte', 'catppuccin-macchiato'],
    }),
    mdx(),
    icon(),
  ],

  plugins: [pluginLineNumbers()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },

  adapter: cloudflare({ imageService: 'compile', prerenderEnvironment: 'node' }),
})
