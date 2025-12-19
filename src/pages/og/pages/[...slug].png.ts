import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

import { generateOgImage } from '@/lib/generate-og-image'

export const prerender = true

// load content collection
const ogImages = await getCollection('ogImages')

export async function getStaticPaths() {
  return ogImages.map((config) => ({
    params: { slug: config.data.slug },
    props: config,
  }))
}

export async function GET(ctx: APIContext) {
  // export og image slug, `/og/posts/<slug/slug/slug>`
  const ogSlug = ctx.params.slug

  // get post by slug
  const config = ogImages.find((config) => config.data.slug === ogSlug)
  if (!config) {
    return new Response('Not Found', { status: 404 })
  }

  const ogImage = await generateOgImage(
    config.data.title,
    config.data.description || '',
  )

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
