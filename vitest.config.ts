import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Unit tests for pure modules only. They must not import `astro:content` (a
// virtual module that exists only inside an Astro build); test through the
// pure module behind the adapter instead, e.g. `@/lib/resume-resolve`.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
