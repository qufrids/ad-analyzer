"use client";

import { createClient } from "./client";

export async function signInWithOAuth(provider: "google" | "apple" | "facebook") {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });
  return error;
}
