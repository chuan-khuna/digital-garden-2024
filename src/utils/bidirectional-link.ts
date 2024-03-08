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

export async function getIncomingNotes(node) {
  const keywords = [node.slug, node.data.title, ...node.data.aliases]
  const allPosts = await getCollection('posts')

  let incomingNotes = []
  for (const post of allPosts) {
    const outgoingNotes = getOutgoingNotes(post)

    for (const keyword of keywords) {
      if (outgoingNotes.includes(keyword)) {
        incomingNotes.push(post.slug)
      }
    }
  }
  return incomingNotes
}