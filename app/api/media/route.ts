// src/app/api/media/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getMedia, deleteMedia } from '../../../lib/db'
import fs from "fs"
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  try {
    const media = await getMedia(page, limit)
    return NextResponse.json({ media })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mediaId = searchParams.get('id')

  if (!mediaId) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
  }

  try {
    // Retrieve media information to get the file path before deletion
    const media = await deleteMedia(mediaId)
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Construct the file path based on the media's category and filename
    const filePath = path.join(process.cwd(), 'public', 'uploads', media.category, media.filename)

    // Delete the file from the file system
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete file from server:', err)
        // We continue here even if file deletion fails, to avoid inconsistent states
      }
    })

    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}

