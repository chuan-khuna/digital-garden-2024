import { getCollection } from 'astro:content'

function extractNoteTitle(wikilink: string) {
  // [[note title:show text]]
  return wikilink.replace('[[', '').replace(']]', '').split(':')[0]
}


export function getOutgoingNotes(node) {
  // node: astro getCollection entry
  const regex = /\[\[([^\]]+)\]\]/g
  let outgoingNotes = node.body.match(regex)

  // extract note title or alias
  outgoingNotes = outgoingNotes.map((note) => {
    return extractNoteTitle(note)
  })

  return outgoingNotes
}


export async function getNoteFromTitle(title) {
  const allPosts = await getCollection('posts', (data) => {
    data.title === title || data.aliases?.includes(title)
  })
  return allPosts
}

export async function getIncomingNotes(node) {
  // node: astro getCollection entry
  const keywords = [node.slug, node.data.title, ...node.data.aliases]
  const allPosts = await getCollection('posts')

  let incomingNotes = []
  for (const post of allPosts) {
    const outgoingNotes = getOutgoingNotes(post)

    for (const keyword of keywords) {
      if (outgoingNotes.includes(keyword)) {
        incomingNotes.push({ slug: post.slug, data: post.data })
      }
    }
  }
  return incomingNotes
}