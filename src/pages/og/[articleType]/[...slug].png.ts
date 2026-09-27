/**
 * OG images for article collections: /og/<collection>/<id>.png,
 * e.g. /og/posts/<post-id>.png. Title, description and style come from the
 * article's frontmatter. Pages link here via `articleOgImage()`.
 */
import type { APIContext } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { OG_ARTICLE_COLLECTIONS, ogImageResponse } from '@/lib/og-image'

export const prerender = true

export async function getStaticPaths() {
  const paths = []
  for (const articleType of OG_ARTICLE_COLLECTIONS) {
    const articles = await getCollection(articleType)
    for (const article of articles) {
      paths.push({
        params: { articleType, slug: article.id },
        props: { article },
      })
    }
  }
  return paths
}

export async function GET({ props }: APIContext) {
  const { article } = props as {
    article: CollectionEntry<'posts'> | CollectionEntry<'notes'>
  }
  return ogImageResponse(article.data)
}
