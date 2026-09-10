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
  type Listing,
} from '@/lib/types'

export default function EditSingleForm({ listing, userId }: { listing: Listing; userId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(listing.title)
  const [brand, setBrand] = useState(listing.brand ?? '')
  const [mold, setMold] = useState(listing.mold ?? '')
  const [plastic, setPlastic] = useState(listing.plastic ?? '')
  const [color, setColor] = useState(listing.color ?? '')
  const [discType, setDiscType] = useState<DiscType>(listing.disc_type)
  const [condition, setCondition] = useState<DiscCondition>(listing.condition)
  const [listingType, setListingType] = useState<ListingType>(listing.listing_type)
  const [status, setStatus] = useState<ListingStatus>(listing.status)
  const [weight, setWeight] = useState(listing.weight_grams ? String(listing.weight_grams) : '')
  const [price, setPrice] = useState(listing.price_nok ? String(listing.price_nok) : '')
  const [description, setDescription] = useState(listing.description ?? '')
  const [location, setLocation] = useState(listing.location ?? '')

  const [existingImages, setExistingImages] = useState<string[]>(listing.image_urls ?? [])
  const [removedImages, setRemovedImages] = useState<Set<string>>(new Set())
  const [newImages, setNewImages] = useState<FileList | null>(null)
  const [allowBids, setAllowBids] = useState(listing.allow_bids)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const { error: updateError } = await supabase
        .from('listings')
        .update({
          title,
          brand,
          mold: mold || null,
          plastic: plastic || null,
          color: color || null,
          disc_type: discType,
          condition,
          listing_type: listingType,
          status,
          weight_grams: weight ? Number(weight) : null,
          price_nok: price ? Number(price) : null,
          description: description || null,
          location: location || null,
          allow_bids: allowBids,
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
        <label className="mb-1 block text-sm font-medium">Tittel *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Merke *</label>
          <input
            required
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Modell</label>
          <input
            value={mold}
            onChange={(e) => setMold(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Plasttype</label>
          <input
            value={plastic}
            onChange={(e) => setPlastic(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Farge</label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Type disk *</label>
          <select
            value={discType}
            onChange={(e) => setDiscType(e.target.value as DiscType)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {Object.entries(DISC_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tilstand *</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as DiscCondition)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Vekt (gram)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Pris (kr)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
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
        <label className="mb-1 block text-sm font-medium">Sted</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Beskrivelse</label>
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
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={allowBids}
          onChange={(e) => setAllowBids(e.target.checked)}
          className="h-4 w-4"
        />
        Tillat bud på denne annonsen
      </label>
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
