'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Listing } from '@/lib/types'

export default function BidForm({ listing }: { listing: Listing }) {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [itemIndex, setItemIndex] = useState('0')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isCollection = listing.listing_kind === 'samling'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setCheckingAuth(false)
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!userId) {
      setError('Du må være logget inn for å legge inn bud.')
      return
    }

    const numericAmount = Number(amount)
    if (!amount || numericAmount <= 0) {
      setError('Skriv inn et gyldig beløp.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase.from('bids').insert({
      listing_id: listing.id,
      bidder_id: userId,
      item_index: isCollection ? Number(itemIndex) : null,
      amount_nok: numericAmount,
    })

    setSubmitting(false)

    if (insertError) {
      setError('Kunne ikke sende budet. Prøv igjen.')
      return
    }

    setAmount('')
    setSuccess(true)
  }

  if (checkingAuth) return null

  return (
    <div className="mt-4 rounded-lg border bg-white p-4">
      <h2 className="mb-2 font-medium">Legg inn bud</h2>

      {!userId ? (
        <p className="text-sm text-gray-500">
          <Link href="/login" className="text-brand-dark underline">
            Logg inn
          </Link>{' '}
          for å legge inn bud på denne annonsen.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
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

          <div>
            <label className="mb-1 block text-sm font-medium">Bud (kr)</label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="F.eks. 150"
              className="w-32 rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {submitting ? 'Sender ...' : 'Send bud'}
          </button>
        </form>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && (
        <p className="mt-2 text-sm text-green-700">Budet ditt er sendt til selgeren!</p>
      )}
    </div>
  )
}
