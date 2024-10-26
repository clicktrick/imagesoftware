// src/lib/db.ts

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

const mediaSchema = new mongoose.Schema({
  filename: String,
  name: String,
  category: String,
  type: String, // 'image' or 'video'
  uploadDate: { type: Date, default: Date.now },
})

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema)

export async function saveMedia(filename: string, name: string, category: string, type: string) {
  await dbConnect()
  const media = new Media({ filename, name, category, type })
  await media.save()
}

export async function getMedia(page: number = 1, limit: number = 20) {
  await dbConnect()
  const skip = (page - 1) * limit
  return Media.find().sort({ uploadDate: -1 }).skip(skip).limit(limit)
}

// New deleteMedia function
export async function deleteMedia(id: string) {
  await dbConnect()
  return Media.findByIdAndDelete(id)
}

export default dbConnect
