"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CredentialState = {
  provider: string;
  label: string;
  email: string;
  password: string;
};

export function RevealCredentials({ subscriptionId }: { subscriptionId: string }) {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<CredentialState | null>(null);

  async function handleReveal() {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/credentials`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to reveal credentials.");
      }

      setCredentials(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Credential reveal failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {!credentials ? (
        <Button type="button" variant="ghost" className="border border-border" onClick={handleReveal} disabled={loading}>
          {loading ? "Decrypting..." : "Reveal credentials"}
        </Button>
      ) : (
        <div className="rounded-2xl border border-border bg-background/50 p-4 text-sm">
          <p className="font-semibold">{credentials.provider}</p>
          <p className="mt-2 text-muted-foreground">{credentials.label}</p>
          <p className="mt-3">Email: {credentials.email}</p>
          <p className="mt-1">Password: {credentials.password}</p>
        </div>
      )}
    </div>
  );
}
