import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's profile and tenant
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, tenants(name)")
    .eq("id", user.id)
    .single();

  const tenantName = profile?.tenants?.name || "Your Workspace";

  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 shrink-0">
        <h1 className="text-lg font-semibold">Overview</h1>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl border border-border/50 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Pipeline Value</h3>
            <p className="text-3xl font-bold">$0.00</p>
          </div>
          <div className="p-6 rounded-2xl border border-border/50 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Win Rate</h3>
            <p className="text-3xl font-bold">0%</p>
          </div>
          <div className="p-6 rounded-2xl border border-border/50 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Deals</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Zap className="w-12 h-12 text-primary mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">AI Briefing Widget</h2>
          <p className="text-muted-foreground max-w-md">
            We are waiting for your first inbound email. Once connected, your AI agent will automatically parse intents and propose Next Best Actions here.
          </p>
        </div>
      </div>
    </>
  );
}
