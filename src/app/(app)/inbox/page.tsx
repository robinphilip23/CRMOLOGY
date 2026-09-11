"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles, User, ArrowRight } from "lucide-react";

const MOCK_EMAILS = [
  {
    id: "1",
    sender: "Pepper Potts",
    email: "pepper@starkindustries.com",
    subject: "Following up on the upgrade proposal",
    preview: "Tony reviewed the proposal and is interested in the upgraded security package. Can we schedule a demo for next Tuesday?",
    time: "10:23 AM",
    aiIntent: "Meeting Request",
    aiConfidence: "98%",
  },
  {
    id: "2",
    sender: "Bruce Wayne",
    email: "b.wayne@wayne.ent",
    subject: "Enterprise Licensing Agreement",
    preview: "We're ready to move forward. Send over the final agreement and I'll have Lucius review it this afternoon.",
    time: "Yesterday",
    aiIntent: "Ready to Close",
    aiConfidence: "95%",
  },
  {
    id: "3",
    sender: "Norman Osborn",
    email: "norman@oscorp.com",
    subject: "Pricing concerns",
    preview: "The latest quote is a bit higher than we discussed. Is there any flexibility on the platform fee?",
    time: "Mon",
    aiIntent: "Negotiation",
    aiConfidence: "89%",
  }
];

export default function InboxPage() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-border/40 bg-card/30 shrink-0">
        <h1 className="text-lg font-semibold">AI Inbox</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Agent Online</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Needs Your Attention</h2>
            <p className="text-muted-foreground text-sm">Your AI agent has parsed these emails and drafted suggested responses.</p>
          </div>

          <div className="space-y-4">
            {MOCK_EMAILS.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
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
                  <span className="text-xs text-muted-foreground font-medium">{msg.time}</span>
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
                    Intent: {msg.aiIntent} <span className="opacity-50 ml-1">({msg.aiConfidence})</span>
                  </div>
                  
                  <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Review Draft <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
