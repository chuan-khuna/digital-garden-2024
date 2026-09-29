import { defineConfig, fontProviders } from 'astro/config'
import react from '@astrojs/react'
// import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

import { unified } from '@astrojs/markdown-remark'

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

  // Astro 7 defaults to the Rust-based Sätteri Markdown pipeline. This garden
  // depends on remark/rehype plugins (wiki-links, callouts, markers, math), so
  // we opt back into the unified() processor from @astrojs/markdown-remark.
  markdown: {
    processor: unified({
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
    }),
  },

  integrations: [
    // Resume Version print pages (/resume-print/<version>, /cv-print/<version>)
    // are noindexed and unlisted, so keep them out of the sitemap.
    sitemap({
      filter: (page) =>
        !/\/(resume-print|cv-print)\/[^/]+\/?$/.test(new URL(page).pathname),
    }), // tailwind({
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
    // Dev runs the server in workerd, which has no `require`. @astrojs/react's
    // server imports a nested CommonJS copy of picomatch (via
    // @astrojs/internal-helpers) that the Cloudflare adapter doesn't pre-bundle,
    // so list it here; the adapter merges this into the worker's optimizeDeps.
    // Pre-bundling the entrypoint too avoids the mid-startup re-optimize reload.
    optimizeDeps: {
      include: [
        '@astrojs/react > @astrojs/internal-helpers > picomatch',
        '@astrojs/cloudflare/entrypoints/server',
      ],
    },
  },

  adapter: cloudflare({ imageService: 'compile', prerenderEnvironment: 'node' }),
})
