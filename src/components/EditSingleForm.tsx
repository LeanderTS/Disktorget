'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  DISC_TYPE_LABELS,
  CONDITION_LABELS,
  LISTING_TYPE_LABELS,
  STATUS_LABELS,
  type DiscType,
  type DiscCondition,
  type ListingType,
  type ListingStatus,
  DISC_BRANDS,
  type Listing,
} from '@/lib/types'

export default function EditSingleForm({ listing, userId }: { listing: Listing; userId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(listing.title)
  const [brand, setBrand] = useState(listing.brand ?? '')
  const [mold, setMold] = useState(listing.mold ?? '')
  const [plastic, setPlastic] = useState(listing.plastic ?? '')
  const [color, setColor] = useState(listing.color ?? '')
  const [discType, setDiscType] = useState<DiscType>(listing.disc_type)
  const [condition, setCondition] = useState<DiscCondition>(listing.condition)
  const [listingType, setListingType] = useState<ListingType>(listing.listing_type)
  const [status, setStatus] = useState<ListingStatus>(listing.status)
  const [weight, setWeight] = useState(listing.weight_grams ? String(listing.weight_grams) : '')
  const [price, setPrice] = useState(listing.price_nok ? String(listing.price_nok) : '')
  const [description, setDescription] = useState(listing.description ?? '')
  const [location, setLocation] = useState(listing.location ?? '')

  const [existingImages, setExistingImages] = useState<string[]>(listing.image_urls ?? [])
  const [removedImages, setRemovedImages] = useState<Set<string>>(new Set())
  const [diskRate, setDiskRate] = useState(listing.disk_rate ?? '')
  const [isHbo, setIsHbo] = useState(listing.is_hbo)
  const [allowBids, setAllowBids] = useState(listing.allow_bids)
  const [auctionEndAt, setAuctionEndAt] = useState(
    listing.auction_end_at ? listing.auction_end_at.slice(0, 16) : ''
  )
  const [newImages, setNewImages] = useState<FileList | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleRemoveImage(url: string) {
    setRemovedImages((prev) => {
      const next = new Set(prev)
      if (next.has(url)) {
        next.delete(url)
      } else {
        next.add(url)
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const keptImages = existingImages.filter((url) => !removedImages.has(url))
      const uploadedUrls: string[] = []

      if (newImages) {
        for (const file of Array.from(newImages)) {
          const path = `${userId}/${Date.now()}-${file.name}`
          const { error: uploadError } = await supabase.storage
