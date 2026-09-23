'use server'

import sharp from 'sharp'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { extractStoragePath } from '@/lib/extractStoragePath'

export async function recompressAllImages() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: 'Ikke autorisert' }
  }

  const admin = createAdminClient()

  const { data: listings } = await admin.from('listings').select('image_urls')
  const urls = Array.from(
    new Set((listings ?? []).flatMap((l) => l.image_urls ?? []))
  )

  let ok = 0
  let failed = 0

  for (const url of urls) {
    try {
      const path = extractStoragePath(url)
      if (!path) throw new Error('Fant ikke lagringssti')

      const res = await fetch(url)
      const buffer = Buffer.from(await res.arrayBuffer())

      const compressed = await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer()

      const finalBuffer = compressed.length < buffer.length ? compressed : buffer

      const { error: uploadError } = await admin.storage
        .from('disc-images')
        .upload(path, finalBuffer, { upsert: true, contentType: 'image/jpeg' })

      if (uploadError) throw uploadError
      ok++
    } catch {
      failed++
    }
  }

  return { ok, failed, total: urls.length }
}
