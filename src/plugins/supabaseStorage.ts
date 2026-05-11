import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

/**
 * Same predicate as {@link supabaseMediaStoragePlugin} — used by `Media` to disable local disk.
 */
export function isSupabaseMediaStorageConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_STORAGE_BUCKET &&
      process.env.SUPABASE_STORAGE_REGION &&
      process.env.SUPABASE_STORAGE_ENDPOINT &&
      process.env.SUPABASE_STORAGE_ACCESS_KEY_ID &&
      process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL,
  )
}

/**
 * Supabase Storage exposes an S3-compatible API.
 * @see https://supabase.com/docs/guides/storage/s3/authentication
 *
 * Create a bucket (e.g. `media`), mark it **public** if you want direct public URLs.
 * Generate S3 keys under Storage → Configuration → S3.
 */
export function supabaseMediaStoragePlugin(): Plugin | undefined {
  if (!isSupabaseMediaStorageConfigured()) return undefined

  const publicObjectUrl = (filename: string, prefix?: string | null): string => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '')
    const bucket = process.env.SUPABASE_STORAGE_BUCKET!
    const path = [prefix, filename]
      .filter(Boolean)
      .flatMap((p) => String(p).split('/'))
      .filter(Boolean)
      .map((seg) => encodeURIComponent(seg))
      .join('/')

    return `${base}/storage/v1/object/public/${bucket}/${path}`
  }

  return s3Storage({
    bucket: process.env.SUPABASE_STORAGE_BUCKET!,
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) => publicObjectUrl(filename, prefix ?? undefined),
      },
    },
    config: {
      credentials: {
        accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.SUPABASE_STORAGE_ENDPOINT!,
      forcePathStyle: true,
      region: process.env.SUPABASE_STORAGE_REGION!,
    },
    clientUploads: false,
  })
}
