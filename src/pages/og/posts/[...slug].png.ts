import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

import { generateOgImage } from '@/lib/generate-og-image'

// load content collection
const posts = await getCollection('posts')

export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }))
}

export async function GET(ctx: APIContext) {
  // export og image slug, `/og/posts/<slug/slug/slug>`
  const ogSlug = ctx.params.slug

  // get post by slug
  const post = posts.find((post) => post.id === ogSlug)
  if (!post) {
    return new Response('Not Found', { status: 404 })
  }

  const ogImage = await generateOgImage(
    post.data.title,
    post.data.description || '',
  )

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
