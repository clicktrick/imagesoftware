// src/components/Gallery.tsx

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type MediaType = {
  _id: string
  filename: string
  name: string
  category: string
  type: string
}

export default function Gallery() {
  const [media, setMedia] = useState<MediaType[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaPerPage = 20

  useEffect(() => {
    fetchMedia()
  }, [page])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMedia(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  async function fetchMedia(isInstantUpdate: boolean = false) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/media?page=${isInstantUpdate ? 1 : page}&limit=${mediaPerPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (isInstantUpdate || page === 1) {
        setMedia(data.media)
      } else {
        setMedia(prevMedia => [...prevMedia, ...data.media])
      }
      setHasMore(data.media.length === mediaPerPage)
    } catch (error) {
      console.error('Error fetching media:', error)
      setError('Failed to fetch media. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMedia(prevMedia => prevMedia.filter(item => item._id !== id))
      } else {
        console.error('Failed to delete media')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const loadMore = () => {
    setPage(prevPage => prevPage + 1)
  }

  const productImages = media.filter(item => item.category === 'product' && item.type === 'image')
  const modelImages = media.filter(item => item.category === 'model' && item.type === 'image')
  const videos = media.filter(item => item.type === 'video')

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <MediaSection title="Product Images" mediaItems={productImages} onDelete={handleDelete} />
        <MediaSection title="Model Images" mediaItems={modelImages} onDelete={handleDelete} />
      </div>
      <MediaSection title="Videos" mediaItems={videos} onDelete={handleDelete} />
      {isLoading && <div className="text-center">Loading...</div>}
      {hasMore && !isLoading && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

function MediaSection({ title, mediaItems, onDelete }: { title: string, mediaItems: MediaType[], onDelete: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mediaItems.map((item) => (
          <MediaCard key={item._id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

function MediaCard({ item, onDelete }: { item: MediaType, onDelete: (id: string) => void }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-md">
      {item.type === 'image' ? (
        <div className="aspect-square relative mb-2">
          <Image
            src={`/uploads/${item.category}/${item.filename}`}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video relative mb-2">
          <video
            src={`/uploads/${item.category}/${item.filename}`}
            className="w-full h-full rounded-md"
            controls
          />
        </div>
      )}
      <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Direct link:</p>
        <div className="flex">
          <input
            type="text"
            readOnly
            value={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${item.category}/${item.filename}`}
            className="w-full text-xs p-2 bg-gray-100 rounded-l border-l border-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${item.category}/${item.filename}`)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Failed to copy link:', err))
            }}
            className="bg-indigo-600 text-white px-3 py-2 rounded-r text-xs hover:bg-indigo-700 focus:outline-none"
            aria-label="Copy link to clipboard"
          >
            Copy
          </button>
        </div>
        <button
          onClick={() => onDelete(item._id)}
          className="mt-2 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
