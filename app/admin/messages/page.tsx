"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, Calendar, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-db";
import { toggleMessageReadAction, deleteMessageAction } from "@/app/admin/actions";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesInboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const client = getSupabaseClient();
      if (client) {
        const { data } = await client
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (active) {
          setMessages(data ?? []);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleReadStatus = async (id: string) => {
    const target = messages.find((m) => m.id === id);
    if (!target) return;
    const nextStatus = !target.is_read;

    try {
      await toggleMessageReadAction(id, nextStatus);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, is_read: nextStatus } : m))
      );
      showToast("Updated message status.");
    } catch (err) {
      console.error("Toggle read status failed:", err);
      showToast("Failed to update message status.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await deleteMessageAction(id);
      setMessages(messages.filter((m) => m.id !== id));
      showToast("Deleted message.");
    } catch (err) {
      console.error("Delete message failed:", err);
      showToast("Failed to delete message.");
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Messages Inbox
          </h1>
          <p className="text-xs text-muted-foreground">
            Review submissions sent from your portfolio contact form.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-2">
          <Mail className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="font-heading font-bold text-base text-foreground">No Messages Received Yet</p>
          <p className="text-xs text-muted-foreground">Form submissions will appear here automatically.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div key={msg.id} className="p-5 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleReadStatus(msg.id)}
                      title={msg.is_read ? "Mark as unread" : "Mark as read"}
                      className={`p-2.5 rounded-xl shrink-0 ${msg.is_read
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                    >
                      {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </button>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-heading text-sm ${msg.is_read ? "font-semibold text-foreground/80" : "font-bold text-foreground"}`}>
                          {msg.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">&lt;{msg.email}&gt;</span>
                        {!msg.is_read && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-bold">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-foreground/90 truncate">
                        Subject: {msg.subject}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span>{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Message Content */}
                {isExpanded && (
                  <div className="p-4 rounded-xl bg-muted/60 border border-border/80 text-xs text-foreground space-y-2 leading-relaxed">
                    <p className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">Message Content:</p>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    <div className="pt-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply to {msg.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
