'use client'

import { useState } from 'react'

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const [openImage, setOpenImage] = useState<string | null>(null)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        Ingen bilder
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt={alt}
            onClick={() => setOpenImage(url)}
            className="aspect-square w-full cursor-zoom-in rounded-lg object-cover transition hover:opacity-90"
          />
        ))}
      </div>

      {openImage && (
        <div
          onClick={() => setOpenImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setOpenImage(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Lukk"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={openImage}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </>
  )
}
