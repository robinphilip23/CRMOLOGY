import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LayoutDashboard, Inbox, Kanban, Settings, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card/30 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-3 h-3 text-primary" />
            </div>
            <span className="font-semibold text-sm tracking-tight truncate">{tenantName}</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-md text-sm font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/pipeline" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-md text-sm font-medium transition-colors">
            <Kanban className="w-4 h-4" />
            Pipeline
          </Link>
          <Link href="/inbox" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-md text-sm font-medium transition-colors">
            <Inbox className="w-4 h-4" />
            Inbox
          </Link>
        </nav>

        <div className="p-4 border-t border-border/40 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-md text-sm font-medium transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
