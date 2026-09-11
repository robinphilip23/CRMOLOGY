"use client";

import { motion } from "framer-motion";
import { Plus, MoreHorizontal, Sparkles } from "lucide-react";

// Mock Data
const COLUMNS = [
  { id: "lead", title: "Lead" },
  { id: "meeting", title: "Meeting Set" },
  { id: "negotiation", title: "Negotiation" },
  { id: "closed", title: "Closed Won" },
];

const MOCK_DEALS = [
  {
    id: "1",
    columnId: "lead",
    title: "Stark Industries Upgrade",
    company: "Stark Industries",
    value: "$120k",
    aiGenerated: true,
  },
  {
    id: "2",
    columnId: "meeting",
    title: "Wayne Ent. Enterprise License",
    company: "Wayne Enterprises",
    value: "$250k",
    aiGenerated: false,
  },
  {
    id: "3",
    columnId: "negotiation",
    title: "Oscorp BioTech Tools",
    company: "Oscorp",
    value: "$85k",
    aiGenerated: true,
  },
];

export default function PipelinePage() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 shrink-0">
        <h1 className="text-lg font-semibold">Pipeline</h1>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </header>

      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 min-w-max h-full">
          {COLUMNS.map((col, idx) => {
            const columnDeals = MOCK_DEALS.filter((d) => d.columnId === col.id);

            return (
              <div key={col.id} className="w-80 flex flex-col">
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
                  {columnDeals.map((deal, i) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + i * 0.1 }}
                      className="bg-card border border-border/50 rounded-lg p-4 shadow-sm cursor-grab hover:border-primary/30 transition-colors group"
                    >
                      {deal.aiGenerated && (
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
                          {deal.company.charAt(0)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
