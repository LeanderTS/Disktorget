'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EditSingleForm from '@/components/EditSingleForm'
import EditCollectionForm from '@/components/EditCollectionForm'
import type { Listing } from '@/lib/types'

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        router.push('/login')
        return
      }
      setUserId(authData.user.id)

      const { data, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single<Listing>()

      if (fetchError || !data) {
        setLoadError('Fant ikke annonsen.')
        setLoading(false)
        return
      }

      if (data.user_id !== authData.user.id) {
        setLoadError('Du har ikke tilgang til å redigere denne annonsen.')
        setLoading(false)
        return
      }

      setListing(data)
      setLoading(false)
    }
    load()
  }, [params.id, router, supabase])

  if (loading) {
    return <p className="text-gray-500">Laster annonse ...</p>
  }

  if (loadError || !listing || !userId) {
    return <p className="text-red-600">{loadError ?? 'Noe gikk galt.'}</p>
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">
        {listing.listing_kind === 'samling' ? 'Rediger samling' : 'Rediger annonse'}
      </h1>

      {listing.listing_kind === 'samling' ? (
        <EditCollectionForm listing={listing} userId={userId} />
      ) : (
        <EditSingleForm listing={listing} userId={userId} />
      )}
    </div>
  )
}
