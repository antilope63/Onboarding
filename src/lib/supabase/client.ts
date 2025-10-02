import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing."
    );
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "pixelplay-onboarding",
      },
    },
  });

  return browserClient;
}
