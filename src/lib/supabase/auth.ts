"use client";

import { createClient } from "./client";

export async function signInWithOAuth(provider: "google" | "azure") {
  const supabase = createClient();
  const options: Parameters<typeof supabase.auth.signInWithOAuth>[0]["options"] =
    provider === "azure"
      ? { redirectTo: `${window.location.origin}/callback`, scopes: "email profile openid" }
      : { redirectTo: `${window.location.origin}/callback` };
  const { error } = await supabase.auth.signInWithOAuth({ provider, options });
  return error;
}
