"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Database, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight">ZeroData CRM</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/onboarding" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-6xl px-6 py-24 md:py-32 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          {/* Left: Copy */}
          <div className="flex-1 flex flex-col items-start text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>The world's first AI-Native CRM</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
            >
              Zero Data Entry. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary/50">Infinite Sales.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
            >
              Stop typing. Our AI agents read your emails, update your pipelines, and draft your replies automatically. You just close deals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/onboarding" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform">
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Animation */}
          <div className="flex-1 relative w-full aspect-square max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
            
            {/* The Simulation */}
            <div className="relative w-full h-full border border-border/50 rounded-2xl bg-black/40 backdrop-blur-xl p-6 overflow-hidden flex flex-col shadow-2xl">
              
              {/* Email incoming */}
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="w-3/4 p-4 rounded-xl bg-card border border-border/50 shadow-lg mb-8 relative z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sarah Jenkins</div>
                    <div className="text-xs text-muted-foreground">Interested in Enterprise Plan</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                  Hi team, we're looking to upgrade our current system for 500 seats. Can we schedule a demo this week?
                </div>
              </motion.div>

              {/* AI Processing lines */}
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 80, opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                className="absolute left-10 top-[110px] w-px bg-gradient-to-b from-primary to-transparent z-10"
              />
              
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                className="absolute left-[34px] top-[150px] bg-background border border-primary text-primary text-[10px] px-2 py-1 rounded-full z-20 flex items-center gap-1 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              >
                <Sparkles className="w-3 h-3" />
                Extracting intent...
              </motion.div>

              {/* Deal Card Created */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 3.5 }}
                className="w-3/4 self-end p-4 rounded-xl bg-card border border-primary/40 shadow-[0_0_30px_rgba(255,255,255,0.05)] mt-auto relative z-20"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-semibold">Acme Corp Enterprise</div>
                  <div className="text-xs font-mono bg-green-500/10 text-green-400 px-2 py-1 rounded-full">$50k</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] px-2 py-1 rounded bg-secondary text-secondary-foreground">Demo Req</span>
                  <span className="text-[10px] px-2 py-1 rounded bg-secondary text-secondary-foreground">High Intent</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Auto-synced</span>
                  <span>Just now</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full max-w-5xl px-6 py-24 border-t border-border/40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Scalable Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Pay a flat seat fee, plus metered usage for the AI agents that do your busywork.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Starter Plan */}
            <div className="flex flex-col p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2">Platform Seat</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/user/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Full CRM Access', 'Real-time Pipelines', 'Unified Inbox', 'Basic Analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="w-full py-3 rounded-full border border-border text-center text-sm font-medium hover:bg-secondary transition-colors">
                Start Free Trial
              </Link>
            </div>

            {/* AI Credits */}
            <div className="flex flex-col p-8 rounded-3xl border border-primary/30 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-6 h-6 text-primary opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary">AI Usage</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">Pay-as-you-go</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['$0.01 per email parsed', '$0.05 per drafted reply', 'Zero-shot entity extraction', 'Unlimited automated workflows'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/onboarding" className="w-full py-3 rounded-full bg-primary text-primary-foreground text-center text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Add AI to Workspace
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        &copy; {new Date().getFullYear()} ZeroData CRM. All rights reserved.
      </footer>
    </div>
  );
}
