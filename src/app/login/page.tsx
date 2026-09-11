"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Zap, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side: Branding / Copy */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 border-r border-border/40 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-lg tracking-tight">ZeroData CRM</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6"
          >
            Welcome back.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Log in to access your AI agents and real-time pipelines. We've been working while you were away.
          </motion.p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-lg tracking-tight">ZeroData CRM</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Sign In</h2>
            <p className="text-sm text-muted-foreground mt-2">Enter your email to receive a magic link</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-medium text-green-500 mb-1">Check your email</h3>
              <p className="text-sm text-muted-foreground">We sent a magic link to {email}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-foreground text-background py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Magic Link"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleOAuth('github')}
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span className="text-sm font-medium">GitHub</span>
                </button>
                <button
                  onClick={() => handleOAuth('google')}
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
