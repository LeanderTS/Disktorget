'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { sendBuyRequest } from '@/app/actions/sendBuyRequest'
import type { Listing } from '@/lib/types'

export default function BuyButton({ listing }: { listing: Listing }) {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [username, setUsername] = useState('En bruker')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [itemIndex, setItemIndex] = useState('0')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const isCollection = listing.listing_kind === 'samling'

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUserId(data.user?.id ?? null)
      setUserEmail(data.user?.email ?? null)

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single()
        setUsername(profile?.username ?? data.user.email ?? 'En bruker')
      }

      setCheckingAuth(false)
    })
  }, [supabase])

  async function handleBuy() {
    if (!userId || !userEmail) return
    setSending(true)
    await sendBuyRequest(
      listing.id,
      isCollection ? Number(itemIndex) : null,
      userEmail,
      username
    )
    setSending(false)
    setSent(true)
  }

  if (checkingAuth) return null

  return (
    <div className="mt-4 rounded-lg border bg-white p-4">
      <h2 className="mb-2 font-medium">Ved "kjøp" får selger beskjed</h2>

      {!userId ? (
        <p className="text-sm text-gray-500">
          <Link href="/login" className="text-brand-dark underline">
            Logg inn
          </Link>{' '}
          for å si fra at du vil kjøpe.
        </p>
      ) : sent ? (
        <p className="text-sm text-green-700">Forespørselen din er sendt til selgeren!</p>
      ) : (
        <div className="flex flex-wrap items-end gap-2">
          {isCollection && (
            <div>
              <label className="mb-1 block text-sm font-medium">Disk</label>
              <select
                value={itemIndex}
                onChange={(e) => setItemIndex(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                {listing.items?.map((_, i) => (
                  <option key={i} value={i}>
                    Disk {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleBuy}
            disabled={sending}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {sending ? 'Sender ...' : 'Kjøp'}
          </button>
        </div>
      )}
    </div>
  )
}
