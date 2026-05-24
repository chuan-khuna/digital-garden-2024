# How to Manage Site Config

Two TypeScript files control site-wide configuration. Neither is an Astro content collection — they are plain TypeScript exports imported directly into components and pages.

---

## `src/content/site.config.ts` — Global site metadata

Used for the `<title>` tag, OG metadata, and any place the site's name/URL is referenced.

```typescript
export const SITE = {
  displayName: string,   // short display name (e.g. 'ALTR')
  siteTitle: string,     // full site title (e.g. "ALTR's Digital Garden")
  github: string,        // GitHub profile URL
}
```

**Used in:** `{{siteTitle}}` token in `src/content/og-images.json`, base layout metadata.

---

## `src/content/portfolio.ts` — Personal info for the homepage bento

Used by the bento grid homepage (`src/pages/index.astro`) and bento card components under `src/components/bento/portfolio-bento/`.

```typescript
export const PORTFOLIO = {
  displayName: string,      // short name shown in intro card
  firstName: string,
  name: string,             // full name
  nickname: string,
  timezone: string,         // IANA timezone (e.g. 'Asia/Bangkok') — used by the live clock card
  avatarUrl: string,        // filename of avatar image in the `public/` folder
  headLine: string,         // one-liner shown below the name
  shortIntros: string[],    // rotating intro lines shown in the bento
  interests: string[],      // interest keywords shown in the AboutMe card
  skills: string[],         // skill keywords shown in the AboutMe card
}
```

### Field notes

- **`timezone`** — Must be a valid IANA timezone string. Used by `src/components/bento/nowtime.tsx` (client-side React) to display the current local time.
- **`avatarUrl`** — Should be the filename only (e.g. `'lucy.jpg'`), not a full path. The file must exist in the `public/` folder.
- **`shortIntros`** — These cycle or display as a list in the intro bento card. Keep them short (one emoji + short phrase).
