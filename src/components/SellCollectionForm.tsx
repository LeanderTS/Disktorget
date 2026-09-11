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
  type CollectionItem,
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

export default function SellCollectionForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [rows, setRows] = useState<Row[]>([emptyRow()])
  const [listingType, setListingType] = useState<ListingType>('salg')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [allowBids, setAllowBids] = useState(false)
  const [images, setImages] = useState<FileList | null>(null)

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

      const items: CollectionItem[] = filledRows.map((row) => ({
        brand: row.brand,
        mold: row.mold || null,
        disc_type: row.discType,
        condition: row.condition,
        disk_rate: row.diskRate || null,
      }))

      const { error: insertError } = await supabase.from('listings').insert({
        user_id: userId,
        listing_kind: 'samling',
        title,
        brand: null,
        items,
        listing_type: listingType,
        allow_bids: allowBids,
        price_nok: price ? Number(price) : null,
        description: description || null,
        location: location || null,
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
        <label className="mb-1 block text-sm font-medium">Tittel på samlingen *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="F.eks. Fin samling med 6 midrange-disker"
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
          <label className="mb-1 block text-sm font-medium">Pris for hele samlingen (kr)</label>
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
        <label className="mb-1 block text-sm font-medium">Sted</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="F.eks. Ålesund"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Beskrivelse av samlingen</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Generell tilstand, hvorfor du selger, om alt må selges samlet, osv."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={allowBids}
          onChange={(e) => setAllowBids(e.target.checked)}
          className="h-4 w-4"
        />
        Tillat at andre kan legge inn bud på denne samlingen
      </label>

      <div>
        <label className="mb-1 block text-sm font-medium">Bilder av samlingen</label>
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
        {submitting ? 'Publiserer ...' : 'Publiser samling'}
      </button>
    </form>
  )
}
