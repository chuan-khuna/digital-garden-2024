import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'

import { generateOgImage } from '@/lib/generate-og-image'

export async function GET(ctx: APIContext) {
  const ogImage = await generateOgImage(
    'Lorem Ipsum',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  )

  return new Response(ogImage, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
