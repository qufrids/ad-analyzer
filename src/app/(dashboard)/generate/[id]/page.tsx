import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import GenerateResults from "./GenerateResults";

export default async function GenerateResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: gen, error } = await supabase
    .from("generated_ads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !gen) notFound();

  const productInfo = gen.product_info as {
    product_name: string;
    fetch_success?: boolean;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 rounded-full">
            Generated Ads
          </span>
          <span className="text-xs text-zinc-500">
            {gen.platforms?.join(" · ")} · {gen.tone}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Your Ad Copy</h1>
        <p className="text-sm text-zinc-500 mt-1">
          AI-generated ad variations ready to copy and use
        </p>
      </div>

      <GenerateResults
        result={gen.result as Parameters<typeof GenerateResults>[0]["result"]}
        productUrl={gen.product_url}
        productInfo={productInfo}
      />
    </div>
  );
}
