"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("[app] Client-side Supabase environment variables not found")
    console.error("[app] NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl)
    console.error("[app] NEXT_PUBLIC_SUPABASE_ANON_KEY:", !!supabaseKey)
    throw new Error(
      "Your project's URL and Key are required to create a Supabase client!\n\n" +
        "Check your Supabase project's API settings to find these values\n\n" +
        "https://supabase.com/dashboard/project/_/settings/api",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
