import React from 'react'
import { PostCard } from '@/components/post/post-card'

type BackReferenceProps = {
  incomingReferences: {
    slug: string
    data: {
      title: string
      description: string
      date: string
    }
  }[]
  rootURL: string
}

export const BackReferenceSection: React.FC<BackReferenceProps> = ({
  incomingReferences,
  rootURL,
}) => {
  return (
    <div className="mt-12">
      Referenced in:
      <div className="mx-auto mt-4 grid max-w-4xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3">
        {incomingReferences.map((item, idx) => (
          <PostCard
            key={idx}
            rootURL={rootURL}
            slug={item.slug}
            title={item.data.title}
            description={item.data.description}
            date={item.data.date}
          />
        ))}
      </div>
    </div>
  )
}
