/**
 * OG images for pages and routes. Pages ask for their image URL here instead of
 * building `og/...` paths themselves; OG routes return `ogImageResponse()`.
 *
 * This module is the Astro adapter: it reads the `ogImages` collection and the
 * site URL, and hands them to the pure rules in `@/lib/og-image/resolve`.
 */
import { getCollection } from 'astro:content'
import { site } from '@/data/site.config'
import type { OgStyle } from '@/content/collection-definitions/common-fields/_og-styles'
import { renderOgImage } from '@/lib/og-image/render'
import {
  assertPageOgImage,
  ogImagePath,
  resolvePageTitle,
  type OgArticleCollection,
} from '@/lib/og-image/resolve'

export {
  OG_ARTICLE_COLLECTIONS,
  type OgArticleCollection,
} from '@/lib/og-image/resolve'

function absolute(path: string): URL {
  return new URL(path, import.meta.env.SITE)
}

/**
 * OG image URL of a page configured in src/content/og-images.json (its title,
 * description and style are customised there). Fails the build if `slug` has
 * no entry.
 */
export async function pageOgImage(slug: string): Promise<URL> {
  const pages = await getCollection('ogImages')
  assertPageOgImage(
    slug,
    pages.map((page) => page.data.slug),
  )
  return absolute(ogImagePath('pages', slug))
}

/** OG image URL of an article (post or note), generated from its frontmatter. */
export function articleOgImage(
  collection: OgArticleCollection,
  id: string,
): URL {
  return absolute(ogImagePath(collection, id))
}

export interface OgImageMeta {
  title: string
  description?: string
  ogStyle: OgStyle
}

/** PNG response for an OG route. Page titles may use `{{siteTitle}}`. */
export async function ogImageResponse({
  title,
  description = '',
  ogStyle,
}: OgImageMeta): Promise<Response> {
  const png = await renderOgImage(
    resolvePageTitle(title, site.siteTitle),
    description,
    ogStyle,
  )
  return new Response(png, {
    status: 200,
    headers: { 'Content-Type': 'image/png' },
  })
}
