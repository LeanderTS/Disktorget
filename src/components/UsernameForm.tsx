'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,20}$/

export default function UsernameForm({
  userId,
  currentUsername,
}: {
  userId: string
  currentUsername: string | null
}) {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState(currentUsername ?? '')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const trimmed = username.trim()

    if (!USERNAME_PATTERN.test(trimmed)) {
      setError(
        'Brukernavn må være 3-20 tegn, og kan bare inneholde bokstaver, tall, punktum, bindestrek og understrek.'
      )
      return
    }

    if (trimmed.toLowerCase() === (currentUsername ?? '').toLowerCase()) {
      setSuccess(true)
      return
    }

    setLoading(true)

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', trimmed)
      .neq('id', userId)
      .maybeSingle()

    if (existing) {
      setLoading(false)
      setError('Dette brukernavnet er allerede i bruk. Prøv et annet.')
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', userId)

    setLoading(false)

    if (updateError) {
      setError('Kunne ikke lagre brukernavnet. Prøv igjen.')
      return
    }

    setSuccess(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-2">
      <div>
        <label className="mb-1 block text-sm font-medium">Brukernavn</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Dette vises som selgernavn på annonsene dine.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">Lagret!</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 self-start rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? 'Lagrer ...' : 'Lagre brukernavn'}
      </button>
    </form>
  )
}
