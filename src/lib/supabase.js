import { createClient } from '@supabase/supabase-js'

// Public config, the publishable key is safe to ship in the browser.
// (The secret key lives only on the server, never here.)
const SUPABASE_URL = 'https://klmeqlouorncytafpbpl.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_uOpfi6T8YH1wYgVuufBF7A_FMNWqiHx'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
