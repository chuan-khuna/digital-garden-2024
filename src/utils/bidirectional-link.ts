import { getCollection } from 'astro:content'
import fs from 'node:fs'
import path from 'node:path'

function extractNoteTitle(wikilink: string) {
  // [[note title:show text]]
  return wikilink.replace('[[', '').replace(']]', '').split(':')[0]
}

function getMarkdownContent(postId: string): string {
  try {
    // Construct the file path - posts are in src/content/posts
    // Try flat file structure first
    const filePath = path.join(
      process.cwd(),
      'src/content/posts',
      `${postId}.md`,
    )
    const mdxPath = path.join(
      process.cwd(),
      'src/content/posts',
      `${postId}.mdx`,
    )

    // Try folder/index structure
    const folderMdPath = path.join(
      process.cwd(),
      'src/content/posts',
      postId,
      'index.md',
    )
    const folderMdxPath = path.join(
      process.cwd(),
      'src/content/posts',
      postId,
      'index.mdx',
    )

    // Try all possible paths
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8')
    } else if (fs.existsSync(mdxPath)) {
      return fs.readFileSync(mdxPath, 'utf-8')
    } else if (fs.existsSync(folderMdPath)) {
      return fs.readFileSync(folderMdPath, 'utf-8')
    } else if (fs.existsSync(folderMdxPath)) {
      return fs.readFileSync(folderMdxPath, 'utf-8')
    }

    return ''
  } catch (error) {
    console.error(`Error reading markdown file for ${postId}:`, error)
    return ''
  }
}

export function getOutgoingNotes(node: any) {
  // node: astro getCollection entry
  const regex = /\[\[([^\]]+)\]\]/g

  // Read the raw markdown content from file system
  const content = getMarkdownContent(node.id)
  let outgoingNotes = content.match(regex)

  if (!outgoingNotes) {
    return []
  }

  // extract note title or alias
  outgoingNotes = outgoingNotes.map((note) => {
    return extractNoteTitle(note)
  })

  return outgoingNotes
}

export async function getNoteFromTitle(title: string) {
  const allPosts = await getCollection('posts', (data) => {
    return data.data.title === title || data.data.aliases?.includes(title)
  })
  return allPosts
}

export async function getIncomingNotes(node: any) {
  // node: astro getCollection entry
  const keywords = [node.id, node.data.title, ...(node.data.aliases || [])]
  const allPosts = await getCollection('posts')

  let incomingNotes = []
  for (const post of allPosts) {
    // Skip the current post
    if (post.id === node.id) {
      continue
    }

    const outgoingNotes = getOutgoingNotes(post)

    for (const keyword of keywords) {
      if (outgoingNotes.includes(keyword)) {
        incomingNotes.push({ id: post.id, data: post.data })
        break // Only add once even if multiple keywords match
      }
    }
  }
  return incomingNotes
}
