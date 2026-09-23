'use client'

import { useState } from 'react'
import { recompressAllImages } from '@/app/actions/recompressAllImages'

export default function AdminImagesPage() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{
    error?: string
    ok?: number
    failed?: number
    total?: number
  } | null>(null)

  async function handleClick() {
    setRunning(true)
    setResult(null)
    const res = await recompressAllImages()
    setResult(res)
    setRunning(false)
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Komprimer alle bilder (admin)</h1>
      <p className="mb-4 text-sm text-gray-600">
        Går gjennom bildene til alle brukere på Disktorget og komprimerer dem. Dette kan
        ta litt tid avhengig av hvor mange bilder som finnes - ikke lukk siden mens den
        jobber.
      </p>
      <button
        onClick={handleClick}
        disabled={running}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {running ? 'Jobber, vennligst vent ...' : 'Start komprimering for alle'}
      </button>

      {result?.error && <p className="mt-3 text-sm text-red-600">{result.error}</p>}
      {result && !result.error && (
        <p className="mt-3 text-sm text-gray-700">
          Ferdig! {result.ok} av {result.total} bilder komprimert
          {result.failed && result.failed > 0 ? ` (${result.failed} feilet)` : ''}.
        </p>
      )}
    </div>
  )
}
