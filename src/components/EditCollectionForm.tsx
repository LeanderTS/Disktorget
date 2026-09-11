'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DISC_TYPE_LABELS,
  CONDITION_LABELS,
  LISTING_TYPE_LABELS,
  STATUS_LABELS,
  type DiscType,
  type DiscCondition,
  type ListingType,
  type ListingStatus,
  type CollectionItem,
  type Listing,
} from '@/lib/types'

interface Row {
  key: string
  brand: string
  mold: string
  discType: DiscType
  condition: DiscCondition
  diskRate: string
}

function emptyRow(): Row {
  return {
    key: crypto.randomUUID(),
    brand: '',
    mold: '',
    discType: 'midrange',
    condition: 'brukt',
    diskRate: '',
  }
}

function rowsFromItems(items: CollectionItem[] | null): Row[] {
  if (!items || items.length === 0) return [emptyRow()]
  return items.map((item) => ({
    key: crypto.randomUUID(),
    brand: item.brand,
    mold: item.mold ?? '',
    discType: item.disc_type,
    condition: item.condition,
    diskRate: item.disk_rate ?? '',
  }))
}

export default function EditCollectionForm({
  listing,
  userId,
}: {
  listing: Listing
  userId: string
}) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(listing.title)
  const [rows, setRows] = useState<Row[]>(rowsFromItems(listing.items))
  const [listingType, setListingType] = useState<ListingType>(listing.listing_type)
  const [status, setStatus] = useState<ListingStatus>(listing.status)
  const [price, setPrice] = useState(listing.price_nok ? String(listing.price_nok) : '')
  const [description, setDescription] = useState(listing.description ?? '')
  const [location, setLocation] = useState(listing.location ?? '')

  const [existingImages, setExistingImages] = useState<string[]>(listing.image_urls ?? [])
  const [removedImages, setRemovedImages] = useState<Set<string>>(new Set())
  const [newImages, setNewImages] = useState<FileList | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()])
  }

  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.key !== key) : prev))
  }

  function toggleRemoveImage(url: string) {
    setRemovedImages((prev) => {
      const next = new Set(prev)
      if (next.has(url)) {
        next.delete(url)
      } else {
        next.add(url)
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const filledRows = rows.filter((row) => row.brand.trim() !== '')
    if (filledRows.length === 0) {
      setError('Legg inn minst én disk med merke utfylt.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const keptImages = existingImages.filter((url) => !removedImages.has(url))
      const uploadedUrls: string[] = []

      if (newImages) {
        for (const file of Array.from(newImages)) {
          const path = `${userId}/${Date.now()}-${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('disc-images')
            .upload(path, file)
          if (uploadError) throw uploadError

          const { data: publicUrl } = supabase.storage
            .from('disc-images')
            .getPublicUrl(path)
          uploadedUrls.push(publicUrl.publicUrl)
        }
      }

      const items: CollectionItem[] = filledRows.map((row) => ({
        brand: row.brand,
        mold: row.mold || null,
        disc_type: row.discType,
        condition: row.condition,
        disk_rate: row.diskRate || null,
      }))

      const { error: updateError } = await supabase
        .from('listings')
        .update({
          title,
          items,
          listing_type: listingType,
          status,
          price_nok: price ? Number(price) : null,
          description: description || null,
          location: location || null,
          image_urls: [...keptImages, ...uploadedUrls],
        })
        .eq('id', listing.id)

      if (updateError) throw updateError

      router.push('/mine')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Noe gikk galt. Prøv igjen.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Tittel på samlingen *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Disker i samlingen *</label>
        <div className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <div key={row.key} className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Disk {index + 1}</span>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Fjern
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={row.brand}
                  onChange={(e) => updateRow(row.key, { brand: e.target.value })}
                  placeholder="Merke *"
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <input
                  value={row.mold}
                  onChange={(e) => updateRow(row.key, { mold: e.target.value })}
                  placeholder="Modell"
                  className="rounded-md border px-3 py-2 text-sm"
                />
                <select
                  value={row.discType}
                  onChange={(e) =>
                    updateRow(row.key, { discType: e.target.value as DiscType })
                  }
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {Object.entries(DISC_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={row.condition}
                  onChange={(e) =>
                    updateRow(row.key, { condition: e.target.value as DiscCondition })
                  }
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  value={row.diskRate}
                  onChange={(e) => updateRow(row.key, { diskRate: e.target.value })}
                  placeholder="Disk Rate (f.eks. 8/10)"
                  className="col-span-2 rounded-md border px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-2 text-sm text-brand-dark underline"
        >
          + Legg til enda en disk
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Salg eller bytte *</label>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value as ListingType)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ListingStatus)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Pris for hele samlingen (kr)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Sted</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Beskrivelse av samlingen</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium">Eksisterende bilder</label>
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((url) => (
              <label key={url} className="relative block cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className={`aspect-square w-full rounded-md object-cover ${
                    removedImages.has(url) ? 'opacity-30' : ''
                  }`}
                />
                <input
                  type="checkbox"
                  checked={removedImages.has(url)}
                  onChange={() => toggleRemoveImage(url)}
                  className="absolute right-1 top-1 h-4 w-4"
                />
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">Huk av et bilde for å fjerne det.</p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Legg til flere bilder</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setNewImages(e.target.files)}
          className="w-full text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {submitting ? 'Lagrer ...' : 'Lagre endringer'}
      </button>
    </form>
  )
}
