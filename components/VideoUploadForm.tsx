'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VideoUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [videoName, setVideoName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !videoName.trim()) return

    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', videoName.trim())
    formData.append('category', 'video')
    formData.append('type', 'video')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setFile(null)
        setVideoName('')
        router.refresh()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to upload video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Video</h3>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="videoName" className="block text-sm font-medium text-gray-700 mb-1">
          Video Name
        </label>
        <input
          type="text"
          id="videoName"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter video name"
          required
        />
      </div>
      <div>
        <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 mb-1">
          Select Video
        </label>
        <input
          type="file"
          id="videoFile"
          accept="video/mp4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>
      <button
        type="submit"
        disabled={!file || !videoName.trim() || uploading}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </form>
  )
}