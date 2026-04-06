"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CredentialState = {
  mode?: "direct_credentials" | "otp_manual" | "email_invite";
  provider: string;
  label: string;
  email: string;
  password: string;
  note?: string;
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

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error(`Unable to copy ${label.toLowerCase()}.`);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {!credentials ? (
        <Button type="button" variant="ghost" className="border border-border" onClick={handleReveal} disabled={loading}>
          {loading ? "Decrypting..." : "Re-access credentials"}
        </Button>
      ) : (
        <div className="rounded-2xl border border-border bg-background/50 p-4 text-sm">
          <p className="font-semibold">{credentials.provider}</p>
          <p className="mt-2 text-muted-foreground">{credentials.label}</p>
          {credentials.email ? (
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="truncate">Email: {credentials.email}</p>
              <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={() => copyValue(credentials.email, "Email")}>
                Copy
              </Button>
            </div>
          ) : null}
          {credentials.password ? (
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="truncate">Password: {credentials.password}</p>
              <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={() => copyValue(credentials.password, "Password")}>
                Copy
              </Button>
            </div>
          ) : null}
          {credentials.note ? <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">{credentials.note}</p> : null}
        </div>
      )}
    </div>
  );
}
