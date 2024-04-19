import React from 'react'
import { CardImageDot } from '@/components/placeholder/card-image'

export const PostCard = ({ rootURL, slug, title, description, date }) => {
  return (
    <a href={`/${rootURL}/${slug}`}>
      <div className="group/backref row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-card p-4 shadow-input transition duration-200 hover:shadow-xl">
        <CardImageDot />
        <div className="transition duration-200 group-hover/backref:translate-x-2">
          <div className="mb-2 mt-2 font-sans font-bold text-foreground">
            {title}
          </div>
          <div className="font-sans text-xs font-normal text-foreground">
            {description}
          </div>
        </div>
      </div>
    </a>
  )
}
