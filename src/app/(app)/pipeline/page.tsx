"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreHorizontal, Sparkles, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Deal = {
  id: string;
  tenant_id: string;
  title: string;
  company: string;
  value: string;
  status: string;
  ai_generated: boolean;
};

const COLUMNS = [
  { id: "lead", title: "Lead" },
  { id: "meeting", title: "Meeting Set" },
  { id: "negotiation", title: "Negotiation" },
  { id: "closed", title: "Closed Won" },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  // Modal Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formValue, setFormValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
        if (profile) {
          setTenantId(profile.tenant_id);
        }
      }

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedDealId) return;

    // Optimistic update
    const previousDeals = [...deals];
    setDeals((prev) => 
      prev.map((deal) => 
        deal.id === draggedDealId ? { ...deal, status: columnId } : deal
      )
    );

    // Save to database
    const { error } = await supabase
      .from("deals")
      .update({ status: columnId })
      .eq("id", draggedDealId);

    if (error) {
      console.error("Error updating deal status:", error);
      // Revert if error
      setDeals(previousDeals);
    }
    
    setDraggedDealId(null);
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    
    setIsSubmitting(true);
    const newDeal = {
      tenant_id: tenantId,
      title: formTitle,
      company: formCompany,
      value: formValue,
      status: "lead",
      ai_generated: false,
    };

    const { data, error } = await supabase
      .from("deals")
      .insert([newDeal])
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      console.error("Error adding deal:", error);
      alert("Failed to add deal: " + error.message + " (Code: " + error.code + ")");
    } else if (data) {
      setDeals((prev) => [data, ...prev]);
      setIsModalOpen(false);
      setFormTitle("");
      setFormCompany("");
      setFormValue("");
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 shrink-0">
        <h1 className="text-lg font-semibold">Pipeline</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </header>

      <div className="flex-1 overflow-x-auto p-8 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex gap-6 min-w-max h-full">
            {COLUMNS.map((col, idx) => {
              const columnDeals = deals.filter((d) => d.status === col.id);

              return (
                <div 
                  key={col.id} 
                  className="w-80 flex flex-col"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-foreground">{col.title}</h3>
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                        {columnDeals.length}
                      </span>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Column Body */}
                  <div className="flex-1 rounded-xl bg-secondary/30 border border-border/40 p-3 flex flex-col gap-3 min-h-[200px]">
                    <AnimatePresence>
                      {columnDeals.map((deal) => (
                        <motion.div
                          key={deal.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          draggable
                          onDragStart={(e: any) => handleDragStart(e, deal.id)}
                          className={`bg-card border border-border/50 rounded-lg p-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors group ${
                            draggedDealId === deal.id ? 'opacity-50' : ''
                          }`}
                        >
                          {deal.ai_generated && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              AI Identified
                            </div>
                          )}
                          <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{deal.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{deal.company}</p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-medium">{deal.value}</span>
                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-medium border border-border">
                              {deal.company.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-semibold mb-6">Add New Deal</h2>
              
              <form onSubmit={handleAddDeal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Deal Title</label>
                  <input
                    required
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Enterprise License Upgrade"
                    className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Company</label>
                  <input
                    required
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Estimated Value</label>
                  <input
                    required
                    type="text"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="e.g. $12,000"
                    className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Deal"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
