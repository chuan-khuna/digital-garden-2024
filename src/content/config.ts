import { z, defineCollection } from "astro:content";

import { postsCollection } from './collections/post';

export const collections = {
  posts: postsCollection,
};