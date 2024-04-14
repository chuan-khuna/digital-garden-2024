import React from 'react'
import { CardImageDot } from '@/components/placeholder/card-image'

export const PostCard = ({ rootURL, slug, title, description, date }) => {
  return (
    <a href={`/${rootURL}/${slug}`}>
      <div className="group/backref row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-white p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none">
        <CardImageDot />
        <div className="transition duration-200 group-hover/backref:translate-x-2">
          <div className="mb-2 mt-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
            {title}
          </div>
          <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
            {description}
          </div>
        </div>
      </div>
    </a>
  )
}
