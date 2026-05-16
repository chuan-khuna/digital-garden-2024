import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

import { generateOgImage } from '@/lib/generate-og-image'
import { SITE } from '@/content/site.config'

export const prerender = true

// load content collection
const ogImages = await getCollection('ogImages')

const resolveTitle = (title: string) =>
  title.replace('{{siteTitle}}', SITE.siteTitle)

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
    resolveTitle(config.data.title),
    config.data.description || '',
    config.data.ogStyle || 'default',
  )

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
