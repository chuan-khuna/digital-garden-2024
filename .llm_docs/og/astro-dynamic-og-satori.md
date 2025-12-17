Dynamic Open Graph Images with Satori and Astro
Open Graph Images are a great way to improve the social sharing experience of your website. In this post I'll show you how to create them and how to generate them dynamically with any static site generator, like Astro, Nuxt or Next.

Sun Feb 26

Written by: Pelle van der Knaap

web perf
astro
open graph
What are Open Graph Images?
Open Graph is a special type of meta tag that can be used to provide additional information about a page. It’s used by social media platforms like Facebook and Twitter to display a preview of a page when it’s shared. The most important tags are og:title, og:description and og:image. The first two are used to display the title and description of the page, while the latter is used to display an image. This image is called the Open Graph Image or OG Image.

Why should the OG Image be dynamic?
On most sites, the OG image is the same on all pages. This is a problem, because it means that the OG image is not representative of the page it’s shared from. However, it’s also possible to manually set the OG image for each page. This is a ton of work, easy to forget and hard to maintain (what if your design changes?).

A better solution is to generate the OG image dynamically for pages that follow the same structure (like articles). This way, the OG image is always representative of the page it’s shared from and the OG image can easily be updated in the future.

How to generate OG Images dynamically?
Your best bet is to use Satori to generate the OG images. It is a relatively new project from Vercel, but it’s already incredibly powerful and easy to use. In fact, it is just a single function call with a JSX template as the parameter.

Are there any alternatives to Satori?
Yes, there are a few alternatives to Satori, but they all have their own drawbacks. Most of the alternatives like Puppeteer require running a headless browser, which adds a ton of complexity and overhead. That’s why we will focus on Satori in this post.

How to install Satori?
You can just install Satori with your favorite package manager.

npm install satori
yarn add satori
How to use Satori?
Now, let’s use it to generate an OG image for this post. First, we need to create a template for the OG image.

We can simply use good old JSX for this.

<div
    style={{
        background: "rgb(24, 32, 47)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
    }}
>
    <h1 style={{ fontSize: "64px", fontWeight: "bold" }}>Hello World!</h1>
</div>
This is already enough to generate a basic OG image! The result of the above code is:

You can see a ton of production examples over at the Satori Playground.

To generate the code with Satori, you simply need to execute the following code.

import satori from "satori";

const svg = await satori(jsxHere, {
    // Add options here
    // For example to embed fonts or set a fixed width & height
    // View all options add https://github.com/vercel/satori
});
This code generates a string of SVG code.

You can either export the SVG code to a file or convert it to another format like PNG with an external library.

ReSVG-JS seems to be the most popular option for converting SVGs to PNGs. This should be fairly easy to implement with their documentation.

There are some issues with ReSVG-JS and Astro, but you can work around the issue by adding the following code to your astro.config.mjs. This marks the library as external, which means that it won’t be bundled with your code and processed by Vite (which causes issue at the moment).

    vite: {
        ssr: { // ssr instead of rollupOptions
            external: ['@resvg/resvg-js']
        },
        build: {
            rollupOptions: {
                external: ['@resvg/resvg-js']
            }
        },
        optimizeDeps: {
            exclude: ['@resvg/resvg-js']
        }
    }
You can find more (up to date) info in the comment thread of this issue.

Vercel’s OG library does this automatically. However, it only works on Vercel.

How to implement Satori in your project
There are a range of methods to implement Satori in your project. I recommend creating an API route that generates the SVG code and then to return it as a string. Most static site generator should allow you to export a range of static paths that you can map to blog posts and their data. This way, you can let the site generator handle all the complicated functionality of storing SVGs.

How to implement Satori with Astro?
Create an API route in your Astro project by creating a file named [og].svg.ts in the src/pages directory.

Fill it with the following code.

import { getCollection } from "astro:content";
// This is the function that returns the SVG code
import generateArticleOG from "@utils/generateArticleOG";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params }) => {
    return new Response(
        // Simply return the SVG code as the body
        await generateArticleOG(params.ogTitle),
        {
            status: 200,
            headers: { "Content-Type": "image/svg" },
        },
    );
};

// Get all posts that are not drafts
const postImportResult = await getCollection("blog", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

// Export all posts as paths that can be mapped to the API route
export function getStaticPaths() {
    return posts
        .filter(({ data }) => !data.ogImage)
        .map(({ data }) => ({
            // Pass the title of the post so we can use it in the API route and as a static path
            params: { ogTitle: data.title },
        }));
}
If you want to use PNG images, you can use the modified SVG code below. See the “Modified Portion” comment for the changes.

import { getCollection } from "astro:content";
// This is the function that returns the SVG code
import generateArticleOG from "@utils/generateArticleOG";
import type { APIRoute } from "astro";

export const get: APIRoute = async ({ params }) => {
    const svg = await generateArticleOG(post.data.title);

    // THE MODIFIED PORTION
    // This utilises the ReSVG-JS library to convert the SVG to a PNG
    // As mentioned before, see https://github.com/yisibl/resvg-js/issues/175#issuecomment-1346452466 if you have any issues with Astro & ReSVG-JS
    // Alternatively, you can use another SVG -> PNG library
    const resvg = new Resvg(svg, null)
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    return new Response(pngBuffer, {
        status: 200,
        headers: { "Content-Type": "image/png" },
    });
    // END OF MODIFIED PORTION
};

// Get all posts that are not drafts
const postImportResult = await getCollection("blog", ({ data }) => !data.draft);
const posts = Object.values(postImportResult);

// Export all posts as paths that can be mapped to the API route
export function getStaticPaths() {
    return posts
        .filter(({ data }) => !data.ogImage)
        .map(({ data }) => ({
            // Pass the title of the post so we can use it in the API route and as a static path
            params: { ogTitle: data.title },
        }));
}
Next, you can simply set the dynamic OG image path in the layout of your post by adding the following html. Change the extension (svg or png) to the one you are using (or both by adding both lines).

<meta property="og:image" content="{`${postTitleHere}`.svg}" />

<!-- Optional: Set the width and height of the OG image -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
How to implement Satori with webpack based static site generators like Nuxt 2?
With Webpack based static site generators like Nuxt 2, you can hook into the Webpack build process to generate OG Images and to add them to the dist folder. This requires more effort, but it allows you to simply add all necessary OG Images to the build.

General advice for implementing Satori with other tech stacks
You can also use serverless functions like Vercel’s, Netlify’s or AWS Lambda to generate the images on the fly. This allows you to generate OG images with an external service, which uncouples the OG image generation from your site. You can use the same code as the JSX template example above and embed the images anywhere with a direct link.

Further Reading
Satori’s Github
Vercel’s edge implementation
Satori Playground
Implementation with Netlify functions
