import React from 'react'
import { CardImageDot } from '@/components/placeholder/card-image'

const BackReferenceCard = ({ title, description }) => {
  return (
    <div className="group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-white p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none">
      <CardImageDot />
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="mb-2 mt-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  )
}

export const BackReferenceSection = ({ incomingReferences, rootURL }) => {
  return (
    <div className="mx-auto max-w-4xl mt-12">
      Referenced in:
      {incomingReferences.map((item, idx) => (
        <a href={`/${rootURL}/${item.slug}`}>
          <BackReferenceCard
            title={item.data.title}
            description={item.data.description}
          />
        </a>
      ))}
    </div>
  )
}
