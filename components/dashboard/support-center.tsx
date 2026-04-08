"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { SupportTicket } from "@/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SupportCenter({ tickets }: { tickets: SupportTicket[] }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to create ticket.");
      }

      toast.success("Support ticket created.");
      setSubject("");
      setMessage("");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Support request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Support and issue reporting</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Need help? Raise a tracked support ticket here, or use the public contact page for faster pre-sale questions.
      </p>
      <form onSubmit={submitTicket} className="mt-4 grid gap-3">
        <Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Issue subject" required />
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe your issue in detail"
          className="min-h-24 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
          required
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Report issue"}
        </Button>
      </form>
      <div className="mt-5 space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-2xl border border-border/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{ticket.subject}</p>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase text-primary">
                {ticket.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{ticket.message}</p>
          </div>
        ))}
        {tickets.length === 0 ? <p className="text-sm text-muted-foreground">No support tickets yet.</p> : null}
      </div>
    </Card>
  );
}
