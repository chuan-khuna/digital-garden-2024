import { postsCollection } from '@/content/collection-definitions/post'
import { navItemsCollection } from '@/content/collection-definitions/nav'

import { resumeSkillsCollection } from '@/content/collection-definitions/resume/skills'
import { resumeProjectsCollection } from '@/content/collection-definitions/resume/project'

export const collections = {
  posts: postsCollection,
  resumeSkills: resumeSkillsCollection,
  resumeProjects: resumeProjectsCollection,
  navItems: navItemsCollection,
}
