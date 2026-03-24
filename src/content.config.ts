import { postsCollection } from '@/content/collection-definitions/post'
import { notesCollection } from './content/collection-definitions/note'
import { navItemsCollection } from '@/content/collection-definitions/nav'

import {
  resumeSkillsCollection,
  resumeProjectsCollection,
  resumeExperiencesCollection,
  resumeEducationsCollection,
  resumeActivitiesCollection,
  resumeInterestsCollection,
  resumeNowCollection,
  resumeHeaderCollection,
} from '@/content/collection-definitions/resume'

import { ogImagesCollection } from '@/content/collection-definitions/og-images'

export const collections = {
  posts: postsCollection,
  notes: notesCollection,
  resumeSkills: resumeSkillsCollection,
  resumeProjects: resumeProjectsCollection,
  resumeExperiences: resumeExperiencesCollection,
  resumeEducations: resumeEducationsCollection,
  resumeActivities: resumeActivitiesCollection,
  resumeInterests: resumeInterestsCollection,
  resumeNow: resumeNowCollection,
  resumeHeader: resumeHeaderCollection,
  navItems: navItemsCollection,
  ogImages: ogImagesCollection,
}
