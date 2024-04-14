import { z, defineCollection } from "astro:content";

import { postsCollection } from './collection-definitions/post';

export const collections = {
  posts: postsCollection,
};