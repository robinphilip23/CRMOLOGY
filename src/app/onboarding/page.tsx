"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Loader2, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const supabase = createClient();

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not found. Please log in again.");

      // 1. Create the tenant
      const tenantId = crypto.randomUUID();
      const { error: tenantError } = await supabase
        .from("tenants")
        .insert([{ id: tenantId, name: companyName }]);

      if (tenantError) throw new Error(tenantError.message);

      // 2. Update the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ tenant_id: tenantId })
        .eq("id", user.id);

      // If the profile doesn't exist yet due to trigger delay, we might need to upsert
      // But assuming the trigger worked, update is fine. If it fails, let's catch it.
      if (profileError) {
          // fallback to upsert if needed
          await supabase.from("profiles").upsert({ id: user.id, tenant_id: tenantId });
      }

      // 3. Update auth user_metadata so middleware knows they have a tenant
      const { error: updateError } = await supabase.auth.updateUser({
        data: { tenant_id: tenantId },
      });

      if (updateError) throw new Error(updateError.message);

      // 4. Redirect to dashboard
      router.push("/dashboard");
      router.refresh();

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl" />
          
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Create your workspace</h1>
            <p className="text-sm text-muted-foreground mt-2">What is the name of your company or team?</p>
          </div>

          <form onSubmit={handleCreateWorkspace} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!mounted || loading || !companyName.trim()}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
