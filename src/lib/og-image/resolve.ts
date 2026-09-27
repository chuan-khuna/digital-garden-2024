/**
 * OG image rules as pure functions: where an image lives and which Pages have
 * one. `@/lib/og-image` is the Astro adapter that loads the `ogImages`
 * collection and calls these; tests call them directly. This module must not
 * import `astro:content`.
 */

/** Article collections that get an OG image at /og/<collection>/<id>.png. */
export const OG_ARTICLE_COLLECTIONS = ['posts', 'notes'] as const
export type OgArticleCollection = (typeof OG_ARTICLE_COLLECTIONS)[number]

/** `pages` for entries in src/content/og-images.json, else an article collection. */
export type OgImageKind = 'pages' | OgArticleCollection

/** Site-relative path of an OG image, e.g. `og/pages/resume.png`. */
export function ogImagePath(kind: OgImageKind, slug: string): string {
  return `og/${kind}/${slug}.png`
}

/**
 * Throws (failing the build) if no entry in src/content/og-images.json has
 * `slug`, so a page can't point `og:image` at an image that is never generated.
 */
export function assertPageOgImage(slug: string, pageSlugs: string[]): void {
  if (!pageSlugs.includes(slug)) {
    throw new Error(
      `[og] No OG image for page "${slug}". Add an entry with "slug": "${slug}" to src/content/og-images.json. ` +
        `Known pages: ${pageSlugs.join(', ') || '(none)'}.`,
    )
  }
}

/** Fills the `{{siteTitle}}` placeholder in an og-images.json title. */
export function resolvePageTitle(title: string, siteTitle: string): string {
  return title.replaceAll('{{siteTitle}}', siteTitle)
}
