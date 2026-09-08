'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SellSingleForm from '@/components/SellSingleForm'
import SellCollectionForm from '@/components/SellCollectionForm'

type Mode = 'choose' | 'enkelt' | 'samling'

export default function SellPage() {
  const router = useRouter()
  const supabase = createClient()

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('choose')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setUserId(data.user.id)
      setCheckingAuth(false)
    })
  }, [router, supabase])

  if (checkingAuth || !userId) {
    return <p className="text-gray-500">Sjekker innlogging ...</p>
  }

  if (mode === 'choose') {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold">Hva vil du legge ut?</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setMode('enkelt')}
            className="rounded-lg border bg-white p-6 text-left shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="text-lg font-semibold text-brand-dark">Selg enkel disk</div>
            <p className="mt-2 text-sm text-gray-600">
              Legg ut én disk med full info: merke, modell, plast, farge, vekt og mer.
            </p>
          </button>

          <button
            onClick={() => setMode('samling')}
            className="rounded-lg border bg-white p-6 text-left shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <div className="text-lg font-semibold text-brand-dark">Selg samling</div>
            <p className="mt-2 text-sm text-gray-600">
              Legg ut flere disker samlet, med enklere info per disk og én samlet pris.
            </p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <button
        onClick={() => setMode('choose')}
        className="mb-4 text-sm text-brand-dark hover:underline"
      >
        ← Bytt type annonse
      </button>

      <h1 className="mb-4 text-2xl font-bold">
        {mode === 'enkelt' ? 'Selg enkel disk' : 'Selg samling'}
      </h1>

      {mode === 'enkelt' ? (
        <SellSingleForm userId={userId} />
      ) : (
        <SellCollectionForm userId={userId} />
      )}
    </div>
  )
}
