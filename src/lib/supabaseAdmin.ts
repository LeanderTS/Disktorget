import { createClient } from '@supabase/supabase-js'

// Egen klient som bruker den hemmelige "service role"-nøkkelen.
// Denne ser forbi ALLE sikkerhetsregler (RLS), og skal derfor ALDRI
// importeres i noe som kjører i nettleseren - kun i server actions.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
