cd /home/claude/disktorget/src/components

cat > BidHistory.tsx << 'EOF'
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface BidRow {
  id: string
  bidder_id: string
  item_index: number | null
  amount_nok: number
  bidderName: string
}

export default function BidHistory({ bids }: { bids: BidRow[] }) {
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [supabase])

  function startEdit(bid: BidRow) {
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

  if (bids.length === 0) return null

  return (
    <div className="mt-4 rounded-lg border bg-white p-4">
      <h2 className="mb-2 font-medium">Budhistorikk</h2>
      <ul className="flex flex-col gap-2">
        {bids.map((bid) => {
          const isOwn = userId === bid.bidder_id
          const isEditing = editingId === bid.id

          return (
            <li key={bid.id} className="flex items-center justify-between text-sm text-gray-700">
              <span>
                {bid.bidderName}
                {bid.item_index !== null && ` · Disk ${bid.item_index + 1}`}
              </span>

              {isEditing ? (
                <span className="flex items-center gap-2">
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
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{bid.amount_nok} kr</span>
                  {isOwn && (
                    <>
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
                    </>
                  )}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

