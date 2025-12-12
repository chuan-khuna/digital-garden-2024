import React from 'react'

type NoteReference = {
  id: string
  data: {
    title: string
    description?: string
    date?: string
    tags?: string[]
    stage?: 'seedling' | 'budding' | 'evergreen'
  }
}

type BackReferenceProps = {
  incomingReferences: NoteReference[]
  outgoingReferences: NoteReference[]
  rootURL: string
}

// Format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Get stage badge
const stageBadge = {
  seedling: '🌱',
  budding: '🌿',
  evergreen: '🌲',
}

type NoteItemProps = {
  note: NoteReference
  rootURL: string
}

const NoteItem: React.FC<NoteItemProps> = ({ note, rootURL }) => {
  const formattedDate = formatDate(note.data.date)

  return (
    <div className="group flex flex-col gap-2 py-3 sm:flex-row sm:items-baseline sm:gap-2">
      {formattedDate && (
        <time
          className="font-mono text-sm text-gray-600 sm:min-w-[120px] sm:shrink-0 dark:text-gray-400"
          dateTime={note.data.date}
        >
          {formattedDate}
        </time>
      )}
      <div className="hidden flex-[0.5] border-b border-dashed border-gray-300 sm:block dark:border-gray-700"></div>
      <div className="flex-[3]">
        <a
          href={`/${rootURL}/${note.id}`}
          className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-accent"
        >
          {note.data.stage && (
            <span aria-label={note.data.stage}>
              {stageBadge[note.data.stage]}
            </span>
          )}
          <span className="group-hover:underline">{note.data.title}</span>
        </a>
        {note.data.tags && note.data.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {note.data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const BackReferenceSection: React.FC<BackReferenceProps> = ({
  incomingReferences,
  outgoingReferences,
  rootURL,
}) => {
  const hasReferences =
    incomingReferences.length > 0 || outgoingReferences.length > 0

  if (!hasReferences) return null

  return (
    <div className="mx-auto mt-16 max-w-[80ch] border-t border-gray-200 pt-8 dark:border-gray-800">
      {incomingReferences.length > 0 && (
        <section className="mb-12">
          <h2 className="text-l mb-4 font-semibold">Incoming Notes</h2>
          <ul className="space-y-1">
            {incomingReferences.map((note, idx) => (
              <li key={idx}>
                <NoteItem note={note} rootURL={rootURL} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {outgoingReferences.length > 0 && (
        <section className="mb-12">
          <h2 className="text-l mb-4 font-semibold">Outgoging Notes</h2>
          <ul className="space-y-1">
            {outgoingReferences.map((note, idx) => (
              <li key={idx}>
                <NoteItem note={note} rootURL={rootURL} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
