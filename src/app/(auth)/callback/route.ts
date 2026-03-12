import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log('=== AUTH CALLBACK ===');
    console.log('Code present:', !!code, '| Type:', type, '| Error:', error?.message ?? null);
    console.log('Auth user:', data?.user ?? null);
    console.log('Is new user:', data?.user?.user_metadata?.is_new_user ?? null);

    if (!error && data.user) {
      // Password recovery flow
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // Upsert profile — safe for both first-time OAuth and returning users
      const meta = data.user.user_metadata ?? {};
      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: data.user.email ?? "",
          full_name: meta.full_name ?? meta.name ?? "",
          subscription_status: "free",
          credits_remaining: 3,
          improvements_remaining: 1,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
      if (upsertError) {
        console.error('Profile upsert error:', upsertError.message);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
