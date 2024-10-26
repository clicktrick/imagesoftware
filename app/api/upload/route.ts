import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { saveMedia } from '../../../lib/db'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  const name: string | null = data.get('name') as string
  const category: string | null = data.get('category') as string
  const type: string | null = data.get('type') as string

  if (!file || !name || !category || !type) {
    return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const safeFileName = name.replace(/[^a-z0-9]/gi, '-').toLowerCase()
  const filename = `${Date.now()}-${safeFileName}.${type === 'video' ? 'mp4' : 'webp'}`
  const filepath = path.join(process.cwd(), 'public', 'uploads', category, filename)

  try {
    if (type === 'image') {
      await sharp(buffer)
        .webp({ quality: 80 })
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .toFile(filepath)
    } else {
      await writeFile(filepath, buffer)
    }

    await saveMedia(filename, name, category, type)
    return NextResponse.json({ success: true, filename, name, category, type })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ success: false, error: 'Failed to save the file' }, { status: 500 })
  }
}