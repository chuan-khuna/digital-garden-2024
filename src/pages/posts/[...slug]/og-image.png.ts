import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import template from './_og-template';

const WIDTH = 1200;
const HEIGHT = 630;

// Load Inter font files
const interRegular = fs.readFileSync(
  path.join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
);

const interBold = fs.readFileSync(
  path.join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
);

export const GET: APIRoute = async function get({ props }) {
  const { entry } = props;
  const { title, stage, tags, date } = entry.data;

  // Format date if available
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  try {
    // Generate the SVG content using Satori and our React template
    const svg = await satori(
      template({
        title,
        stage,
        tags,
        date: formattedDate,
      }),
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          {
            name: 'Inter',
            data: interRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: interBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );

    // Convert the generated SVG to a PNG image using Sharp
    const png = await sharp(Buffer.from(svg), {
      density: 150,
    })
      .png()
      .toBuffer();

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);

    // Return a simple fallback response
    return new Response('Error generating image', {
      status: 500,
    });
  }
};

export async function getStaticPaths() {
  const posts = await getCollection('posts');

  return posts.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const prerender = true;