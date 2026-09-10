'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DISC_TYPE_LABELS,
  CONDITION_LABELS,
  LISTING_TYPE_LABELS,
  type DiscType,
  type DiscCondition,
  type ListingType,
} from '@/lib/types'

export default function SellSingleForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [brand, setBrand] = useState('')
  const [mold, setMold] = useState('')
  const [plastic, setPlastic] = useState('')
  const [color, setColor] = useState('')
  const [discType, setDiscType] = useState<DiscType>('midrange')
  const [condition, setCondition] = useState<DiscCondition>('brukt')
  const [listingType, setListingType] = useState<ListingType>('salg')
  const [weight, setWeight] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState<FileList | null>(null)
  const [allowBids, setAllowBids] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const imageUrls: string[] = []
      if (images) {
        for (const file of Array.from(images)) {
          const path = `${userId}/${Date.now()}-${file.name}`
          const { error: uploadError } = await supabase.storage
            .from('disc-images')
            .upload(path, file)
          if (uploadError) throw uploadError

          const { data: publicUrl } = supabase.storage
            .from('disc-images')
            .getPublicUrl(path)
          imageUrls.push(publicUrl.publicUrl)
        }
      }

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: userId,
        listing_kind: 'enkelt',
        title,
        brand,
        mold: mold || null,
        plastic: plastic || null,
        color: color || null,
        disc_type: discType,
        condition,
        listing_type: listingType,
        weight_grams: weight ? Number(weight) : null,
        price_nok: price ? Number(price) : null,
        description: description || null,
        location: location || null,
        allow_bids: allowBids,
        image_urls: imageUrls,
      })

      if (insertError) throw insertError

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
          placeholder="F.eks. Innova Destroyer - Star plast"
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
            placeholder="Innova, Discraft, Latitude 64 ..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Modell</label>
          <input
            value={mold}
            onChange={(e) => setMold(e.target.value)}
            placeholder="Destroyer, Buzzz, Zone ..."
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
            placeholder="Star, ESP, Opto ..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Farge</label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Rød, blå, oransje ..."
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
            placeholder="La stå tom for 'pris på forespørsel'"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

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
        <label className="mb-1 block text-sm font-medium">Sted</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="F.eks. Ålesund"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Beskrivelse</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Slitasje, kastfølelse, antall kast, e.l."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Bilder</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="w-full text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {submitting ? 'Publiserer ...' : 'Publiser annonse'}
      </button>
    </form>
  )
}
