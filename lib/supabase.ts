import { createClient } from '@supabase/supabase-js'

// Read the Supabase credentials from environment variables. In Vercel
// deployments these will be populated automatically if you define
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton Supabase client. Import this from anywhere in your app
// when you need to query the database. Do not create multiple
// instances; Next.js will handle caching across the app router.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)