export type DiscType = 'putter' | 'midrange' | 'fairway_driver' | 'distance_driver' | 'annet'
export type DiscCondition = 'ny' | 'som_ny' | 'brukt' | 'slitt'
export type ListingType = 'salg' | 'bytte' | 'salg_eller_bytte'
export type ListingStatus = 'aktiv' | 'reservert' | 'solgt'
export type ListingKind = 'enkelt' | 'samling'

export interface CollectionItem {
  brand: string
  mold: string | null
  disc_type: DiscType
  condition: DiscCondition
}

export interface Listing {
  id: string
  user_id: string
  title: string
  brand: string | null
  mold: string | null
  plastic: string | null
  color: string | null
  disc_type: DiscType
  condition: DiscCondition
  speed: number | null
  glide: number | null
  turn: number | null
  fade: number | null
  weight_grams: number | null
  price_nok: number | null
  listing_type: ListingType
  status: ListingStatus
  listing_kind: ListingKind
  allow_bids: boolean
  items: CollectionItem[] | null
  description: string | null
  image_urls: string[]
  location: string | null
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  location: string | null
  contact_email: string | null
  contact_phone: string | null
  show_phone: boolean
  created_at: string
}

export const DISC_TYPE_LABELS: Record<DiscType, string> = {
  putter: 'Putter',
  midrange: 'Midrange',
  fairway_driver: 'Fairway driver',
  distance_driver: 'Distance driver',
  annet: 'Annet',
}

export const CONDITION_LABELS: Record<DiscCondition, string> = {
  ny: 'Ny',
  som_ny: 'Som ny',
  brukt: 'Brukt',
  slitt: 'Slitt',
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  salg: 'Til salgs',
  bytte: 'Byttes',
  salg_eller_bytte: 'Salg eller bytte',
}

export const STATUS_LABELS: Record<ListingStatus, string> = {
  aktiv: 'Aktiv',
  reservert: 'Reservert',
  solgt: 'Solgt',
}
