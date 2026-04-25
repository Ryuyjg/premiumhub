"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import type { SupportMessage, SupportTicket } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

function getTicketMessages(ticket: SupportTicket | null): SupportMessage[] {
  if (!ticket) {
    return [];
  }

  if (Array.isArray(ticket.messages) && ticket.messages.length) {
    return [...ticket.messages].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  }

  return [
    {
      id: `${ticket.id}-initial`,
      sender: "user",
      body: ticket.message,
      email: ticket.email,
      createdAt: ticket.createdAt
    }
  ];
}

export function SupportManager({ tickets }: { tickets: SupportTicket[] }) {
  const [ticketList, setTicketList] = useState(tickets);
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || "");
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const selectedTicket = useMemo(
    () => ticketList.find((ticket) => ticket.id === selectedTicketId) || ticketList[0] || null,
    [ticketList, selectedTicketId]
  );
  const messages = useMemo(() => getTicketMessages(selectedTicket), [selectedTicket]);

  const loadTickets = useCallback(async (preferredTicketId?: string) => {
    try {
      const response = await fetch("/api/admin/support/tickets", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as SupportTicket[];
      setTicketList(payload);
      if (preferredTicketId) {
        setSelectedTicketId(preferredTicketId);
      } else if (!selectedTicketId && payload[0]?.id) {
        setSelectedTicketId(payload[0].id);
      }
    } catch {
      // Keep the current ticket visible if refresh fails.
    }
  }, [selectedTicketId]);

  useEffect(() => {
    setTicketList(tickets);
    if (!selectedTicketId && tickets[0]?.id) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadTickets();
    }, 8000);

    return () => window.clearInterval(interval);
  }, [loadTickets]);

  async function updateStatus(id: string, status: SupportTicket["status"]) {
    const response = await fetch("/api/admin/support/tickets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data.error || "Unable to update ticket.");
      return;
    }
    toast.success("Ticket updated.");
    await loadTickets(id);
  }

  async function sendReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTicket || !reply.trim()) {
      return;
    }

    setReplying(true);
    try {
      const response = await fetch("/api/admin/support/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTicket.id, message: reply.trim() })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to send reply.");
      }

      toast.success("Reply sent.");
      setReply("");
      await loadTickets(selectedTicket.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reply failed.");
    } finally {
      setReplying(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Live support inbox</h2>
          <p className="mt-1 text-sm text-muted-foreground">Reply to customers directly from the admin panel.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          {ticketList.length} thread{ticketList.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.38fr_0.62fr]">
        <div className="max-h-[36rem] space-y-2 overflow-y-auto pr-1">
          {ticketList.map((ticket) => {
            const active = selectedTicket?.id === ticket.id;
            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  active ? "border-primary/35 bg-primary/10" : "border-border/70 bg-background/60 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{ticket.subject}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{ticket.email}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ticket.message}</p>
              </button>
            );
          })}
          {ticketList.length === 0 ? <p className="text-sm text-muted-foreground">No tickets.</p> : null}
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/55 p-4">
          {selectedTicket ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-3">
                <div>
                  <p className="font-semibold">{selectedTicket.subject}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedTicket.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => updateStatus(selectedTicket.id, "in_progress")}>
                    In progress
                  </Button>
                  <Button type="button" variant="outline" onClick={() => updateStatus(selectedTicket.id, "resolved")}>
                    Resolve
                  </Button>
                  <Button type="button" variant="outline" onClick={() => updateStatus(selectedTicket.id, "open")}>
                    Reopen
                  </Button>
                </div>
              </div>

              <div className="mt-4 max-h-[30rem] space-y-3 overflow-y-auto pr-1">
                {messages.map((item) => {
                  const fromAdmin = item.sender === "admin";
                  return (
                    <div key={item.id} className={`flex ${fromAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm ${
                          fromAdmin ? "bg-primary text-white" : "border border-border/70 bg-muted/35 text-foreground"
                        }`}
                      >
                        <p className="leading-6">{item.body}</p>
                        <p className={`mt-2 text-[10px] ${fromAdmin ? "text-white/75" : "text-muted-foreground"}`}>
                          {fromAdmin ? "Admin" : selectedTicket.email} - {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={sendReply} className="mt-4 flex gap-2">
                <Input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Reply to customer"
                  disabled={replying}
                />
                <Button type="submit" disabled={replying || !reply.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex min-h-80 items-center justify-center text-center text-sm text-muted-foreground">
              Select a support thread.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
