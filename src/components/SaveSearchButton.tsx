'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Params = { [key: string]: string | undefined }

export default function SaveSearchButton({ searchParams }: { searchParams: Params }) {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const q = searchParams.q?.trim() || null
  const brand = searchParams.brand || null
  const discType = searchParams.disc_type || null
  const condition = searchParams.condition || null
  const location = searchParams.location?.trim() || null
  const maxPriceNum = searchParams.max_price ? Number(searchParams.max_price) : NaN
  const maxPrice = Number.isNaN(maxPriceNum) ? null : maxPriceNum

  const hasFilter = !!(q || brand || discType || condition || location || maxPrice)
  const searchKey = JSON.stringify([q, brand, discType, condition, location, maxPrice])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setChecking(false)
    })
  }, [supabase])

  useEffect(() => {
    setStatus('idle')
    setMessage(null)
  }, [searchKey])

  if (checking || !hasFilter) return null

  if (!userId) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        <Link href="/login" className="text-brand-dark underline">
          Logg inn
        </Link>{' '}
        for å få varsel om nye treff på dette søket.
      </p>
    )
  }

  async function save() {
    setStatus('saving')
    setMessage(null)

    const { error } = await supabase.from('saved_searches').insert({
      user_id: userId,
      q,
      brand,
      disc_type: discType,
      condition,
      location,
      max_price: maxPrice,
    })

    if (error) {
      setStatus('error')
      setMessage(
        error.message.includes('row-level security')
          ? 'Du kan ha maks 10 lagrede søk. Slett et gammelt under Min side.'
          : 'Kunne ikke lagre søket. Prøv igjen.'
      )
      return
    }

    setStatus('saved')
  }

  return (
    <div className="mt-4">
      {status === 'saved' ? (
        <p className="text-sm text-green-700">
          Søket er lagret! Du får e-post når noe nytt matcher.{' '}
          <Link href="/mine/sok" className="underline">
            Se lagrede søk
          </Link>
        </p>
      ) : (
        <button
          onClick={save}
          disabled={status === 'saving'}
          className="w-full rounded-md border border-brand px-3 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-light disabled:opacity-50"
        >
          {status === 'saving' ? 'Lagrer ...' : 'Varsle meg om nye treff'}
        </button>
      )}
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </div>
  )
}
