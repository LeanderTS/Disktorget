'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface MyBidRow {
  id: string
  listing_id: string
  listing_title: string
  item_index: number | null
  amount_nok: number
}

export default function MyBidsList({ bids }: { bids: MyBidRow[] }) {
  const router = useRouter()
  const supabase = createClient()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [busy, setBusy] = useState(false)

  function startEdit(bid: MyBidRow) {
    setEditingId(bid.id)
    setEditValue(String(bid.amount_nok))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValue('')
  }

  async function saveEdit(id: string) {
    const numericAmount = Number(editValue)
    if (!editValue || numericAmount <= 0) return

    setBusy(true)
    await supabase.from('bids').update({ amount_nok: numericAmount }).eq('id', id)
    setBusy(false)
    setEditingId(null)
    router.refresh()
  }

  async function deleteBid(id: string) {
    setBusy(true)
    await supabase.from('bids').delete().eq('id', id)
    setBusy(false)
    router.refresh()
  }

  if (bids.length === 0) {
    return <p className="text-gray-500">Du har ikke lagt inn noen bud ennå.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {bids.map((bid) => {
        const isEditing = editingId === bid.id

        return (
          <div
            key={bid.id}
            className="flex items-center justify-between rounded-lg border bg-white p-3"
          >
            <div>
              <Link href={`/disc/${bid.listing_id}`} className="font-medium hover:underline">
                {bid.listing_title}
              </Link>
              {bid.item_index !== null && (
                <p className="text-sm text-gray-500">Disk {bid.item_index + 1}</p>
              )}
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-20 rounded-md border px-2 py-1 text-sm"
                />
                <button
                  onClick={() => saveEdit(bid.id)}
                  disabled={busy}
                  className="text-xs text-brand-dark hover:underline"
                >
                  Lagre
                </button>
                <button onClick={cancelEdit} className="text-xs text-gray-500 hover:underline">
                  Avbryt
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-brand-dark">{bid.amount_nok} kr</span>
                <button
                  onClick={() => startEdit(bid)}
                  className="text-xs text-brand-dark hover:underline"
                >
                  Rediger
                </button>
                <button
                  onClick={() => deleteBid(bid.id)}
                  disabled={busy}
                  className="text-xs text-red-600 hover:underline"
                >
                  Slett
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
