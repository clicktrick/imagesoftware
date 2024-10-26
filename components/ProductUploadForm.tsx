'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [imageName, setImageName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !imageName.trim()) return

    setUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', imageName.trim())
    formData.append('category', 'product')
    formData.append('type', 'image') // Manually set type to 'image'

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setFile(null)
        setImageName('')
        router.refresh()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Product Image</h3>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="productImageName" className="block text-sm font-medium text-gray-700 mb-1">
          Image Name
        </label>
        <input
          type="text"
          id="productImageName"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter image name"
          required
        />
      </div>
      <div>
        <label htmlFor="productImageFile" className="block text-sm font-medium text-gray-700 mb-1">
          Select Image
        </label>
        <input
          type="file"
          id="productImageFile"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>
      <button
        type="submit"
        disabled={!file || !imageName.trim() || uploading}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Product Image'}
      </button>
    </form>
  )
}
