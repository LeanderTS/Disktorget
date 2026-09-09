'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,20}$/

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedUsername = username.trim()

    if (!USERNAME_PATTERN.test(trimmedUsername)) {
      setError(
        'Brukernavn må være 3-20 tegn, og kan bare inneholde bokstaver, tall, punktum, bindestrek og understrek.'
      )
      return
    }

    setLoading(true)

    // Sjekk om brukernavnet allerede er tatt
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', trimmedUsername)
      .maybeSingle()

    if (existing) {
      setLoading(false)
      setError('Dette brukernavnet er allerede i bruk. Prøv et annet.')
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: trimmedUsername },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('duplicate')) {
        setError('Dette brukernavnet er allerede i bruk. Prøv et annet.')
      } else {
        setError(signUpError.message)
      }
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="mx-auto max-w-sm">
        <h1 className="mb-4 text-2xl font-bold">Sjekk e-posten din</h1>
        <p className="text-gray-600">
          Vi har sendt deg en bekreftelseslenke. Trykk på lenken i e-posten for å aktivere
          kontoen din, og logg deretter inn.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Registrer deg</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <input
            type="text"
            placeholder="Brukernavn"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Dette vises som selgernavn på annonsene dine.
          </p>
        </div>

        <input
          type="email"
          placeholder="E-post"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="Passord (minst 6 tegn)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? 'Registrerer ...' : 'Registrer deg'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Har du allerede konto?{' '}
        <Link href="/login" className="text-brand-dark underline">
          Logg inn her
        </Link>
      </p>
    </div>
  )
}
