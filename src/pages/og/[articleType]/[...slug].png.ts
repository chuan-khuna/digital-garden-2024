/**
 * Dynamic Open Graph (OG) image generator for article-derived collections
 * eg posts, notes, essays, etc
 *
 * /og/posts/<post-slug>
 * /og/notes/<note-slug>
 * /og/<articleType>/<slug>
 *
 */

import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

import { generateOgImage } from '@/lib/generate-og-image'

export const prerender = true

// Define valid article types
const VALID_ARTICLE_TYPES = ['posts', 'notes'] as const
type ArticleType = (typeof VALID_ARTICLE_TYPES)[number]

export async function getStaticPaths() {
  const paths = []

  // Generate paths for each article type
  for (const articleType of VALID_ARTICLE_TYPES) {
    const articles = await getCollection(articleType)

    for (const article of articles) {
      paths.push({
        params: {
          articleType,
          slug: article.id,
        },
        props: {
          article,
          articleType,
        },
      })
    }
  }

  return paths
}

export async function GET(ctx: APIContext) {
  const { articleType, slug } = ctx.params

  // Validate article type
  if (
    !articleType ||
    !VALID_ARTICLE_TYPES.includes(articleType as ArticleType)
  ) {
    return new Response('Invalid article type', { status: 400 })
  }

  // Get the article from props (passed from getStaticPaths)
  const article = ctx.props.article as
    | CollectionEntry<'posts'>
    | CollectionEntry<'notes'>

  if (!article) {
    return new Response('Not Found', { status: 404 })
  }

  const ogImage = await generateOgImage(
    article.data.title,
    article.data.description || '',
    article.data.ogStyle || 'default',
  )

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
