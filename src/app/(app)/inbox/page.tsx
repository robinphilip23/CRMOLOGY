"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, User, ArrowRight, X, Check, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Email = {
  id: string;
  tenant_id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  time_display: string;
  ai_intent: string;
  ai_confidence: string;
};

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
        if (profile) {
          setTenantId(profile.tenant_id);
        }
      }

      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSync = async () => {
    if (!selectedEmail || !tenantId) return;
    setIsSyncing(true);

    try {
      // 1. Create a new Deal from the Email
      const newDeal = {
        tenant_id: tenantId,
        title: selectedEmail.subject,
        company: selectedEmail.sender,
        value: "TBD", // Needs manual input later, or AI could extract it
        status: "lead",
        ai_generated: true,
      };

      const { error: insertError } = await supabase.from("deals").insert([newDeal]);
      if (insertError) throw insertError;

      // 2. Delete the Email from Inbox
      const { error: deleteError } = await supabase.from("emails").delete().eq("id", selectedEmail.id);
      if (deleteError) throw deleteError;

      // Update UI state
      setEmails((prev) => prev.filter((e) => e.id !== selectedEmail.id));
      setSelectedEmail(null);
    } catch (error: any) {
      console.error("Error syncing email to pipeline:", error);
      alert("Failed to sync to pipeline: " + (error.message || JSON.stringify(error)));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 shrink-0">
        <h1 className="text-lg font-semibold">AI Inbox</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Agent Online</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Needs Your Attention</h2>
              <p className="text-muted-foreground text-sm">Your AI agent has parsed these emails and drafted suggested responses.</p>
            </div>

            {emails.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border/50 rounded-2xl bg-card/30">
                <Mail className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Inbox Zero</h3>
                <p className="text-sm text-muted-foreground">You have reviewed all inbound AI drafts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {emails.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedEmail(msg)}
                      className="group relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{msg.sender}</h3>
                            <p className="text-xs text-muted-foreground">{msg.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{msg.time_display}</span>
                      </div>

                      <div className="relative z-10 mb-4">
                        <h4 className="text-sm font-semibold mb-1">{msg.subject}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {msg.preview}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/40 relative z-10">
                        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md text-xs font-semibold border border-primary/20">
                          <Sparkles className="w-3.5 h-3.5" />
                          Intent: {msg.ai_intent} <span className="opacity-50 ml-1">({msg.ai_confidence})</span>
                        </div>
                        
                        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          Review Draft <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-out Modal for Draft Review */}
      <AnimatePresence>
        {selectedEmail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmail(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border/50 shadow-2xl z-50 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-secondary/20">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Draft Review
                </h2>
                <button 
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 -mr-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original Context</h3>
                    <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 text-sm leading-relaxed">
                      <p><span className="font-medium text-foreground">From:</span> {selectedEmail.sender}</p>
                      <p className="mb-2"><span className="font-medium text-foreground">Subject:</span> {selectedEmail.subject}</p>
                      <p className="text-muted-foreground">{selectedEmail.preview}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
                      AI Generated Reply
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full lowercase">draft</span>
                    </h3>
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-sm leading-relaxed">
                      <p className="mb-4">Hi {selectedEmail.sender.split(' ')[0]},</p>
                      <p className="mb-4">Thanks for reaching out! I'm glad to hear you are interested in moving forward.</p>
                      <p className="mb-4">I will go ahead and log this in our system as a priority lead. Can we schedule a brief 15-minute sync next week to finalize the details?</p>
                      <p>Best,<br/>CRM Agent</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 bg-secondary/10">
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Approving this will instantly fire the reply and add a new deal to your pipeline.
                </p>
                <button
                  onClick={handleApproveSync}
                  disabled={isSyncing}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
                >
                  {isSyncing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Approve & Sync to Pipeline
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
