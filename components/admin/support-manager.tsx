"use client";

import { toast } from "sonner";
import type { SupportTicket } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SupportManager({ tickets }: { tickets: SupportTicket[] }) {
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
    window.location.reload();
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Support tickets</h2>
      <p className="mt-1 text-sm text-muted-foreground">Monitor and resolve customer reports quickly.</p>
      <div className="mt-5 space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-2xl border border-border/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{ticket.subject}</p>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase text-primary">
                {ticket.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{ticket.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">{ticket.message}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => updateStatus(ticket.id, "in_progress")}>
                In progress
              </Button>
              <Button type="button" variant="outline" onClick={() => updateStatus(ticket.id, "resolved")}>
                Resolve
              </Button>
              <Button type="button" variant="outline" onClick={() => updateStatus(ticket.id, "open")}>
                Reopen
              </Button>
            </div>
          </div>
        ))}
        {tickets.length === 0 ? <p className="text-sm text-muted-foreground">No tickets.</p> : null}
      </div>
    </Card>
  );
}
