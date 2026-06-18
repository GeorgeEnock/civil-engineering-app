import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Invalid Supabase URL. Set VITE_SUPABASE_URL in your .env file to your Supabase project URL, e.g. https://your-project-ref.supabase.co')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your_supabase_anon_key')) {
  throw new Error('Invalid Supabase anon key. Set VITE_SUPABASE_ANON_KEY in your .env file to your Supabase anon public key')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
