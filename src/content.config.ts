import { postsCollection } from '@/content/collection-definitions/post'
import { navItemsCollection } from '@/content/collection-definitions/nav'

import {
  resumeSkillsCollection,
  resumeProjectsCollection,
  resumeExperiencesCollection,
  resumeEducationsCollection,
} from '@/content/collection-definitions/resume'

import { ogImagesCollection } from '@/content/collection-definitions/og-images'

export const collections = {
  posts: postsCollection,
  resumeSkills: resumeSkillsCollection,
  resumeProjects: resumeProjectsCollection,
  resumeExperiences: resumeExperiencesCollection,
  resumeEducations: resumeEducationsCollection,
  navItems: navItemsCollection,
  ogImages: ogImagesCollection,
}
