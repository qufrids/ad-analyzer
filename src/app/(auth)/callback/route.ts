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

    if (!error && data.user) {
      // Password recovery flow
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // Ensure a profile exists (handles OAuth first-time logins)
      // The DB trigger handles email signups, but OAuth users may need this
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        const meta = data.user.user_metadata ?? {};
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email ?? "",
          full_name: meta.full_name ?? meta.name ?? "",
          subscription_status: "free",
          credits_remaining: 3,
          improvements_remaining: 1,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
