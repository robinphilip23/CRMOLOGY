"use client";

import { LayoutDashboard, Inbox, Kanban, Settings, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children, tenantName = "Your Workspace" }: { children: React.ReactNode, tenantName?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pipeline", href: "/pipeline", icon: Kanban },
    { name: "Inbox", href: "/inbox", icon: Inbox },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card/30 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-3 h-3 text-primary" />
            </div>
            <span className="font-semibold text-sm tracking-tight">{tenantName}</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground rounded-md text-sm font-medium transition-colors">
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
