/**
 * OG images for pages that are not content entries (home, resume, uses, …):
 * /og/pages/<slug>.png, one per entry in src/content/og-images.json, where each
 * page's title, description and style are customised. Pages link here via
 * `pageOgImage(slug)`.
 */
import type { APIContext } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { ogImageResponse } from '@/lib/og-image'

export const prerender = true

export async function getStaticPaths() {
  const pages = await getCollection('ogImages')
  return pages.map((page) => ({
    params: { slug: page.data.slug },
    props: { page },
  }))
}

export async function GET({ props }: APIContext) {
  const { page } = props as { page: CollectionEntry<'ogImages'> }
  return ogImageResponse(page.data)
}
