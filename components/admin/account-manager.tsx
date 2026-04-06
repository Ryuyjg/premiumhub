"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { OttAccount, Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AccountManager({
  accounts,
  products
}: {
  accounts: OttAccount[];
  products: Product[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [limitByAccount, setLimitByAccount] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) =>
      `${account.provider} ${account.label} ${account.status}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [accounts, query]);
  const lowStockCount = useMemo(
    () => accounts.filter((account) => account.status !== "disabled" && account.maxUsers - account.activeUsers <= 1).length,
    [accounts]
  );

  async function createAccount(formData: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        productId: String(formData.get("productId")),
        provider: String(formData.get("provider")),
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        maxUsers: Number(formData.get("maxUsers")),
        label: String(formData.get("label"))
      };

      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to store OTT account.");
      }

      toast.success("Credential vault updated. Refresh to view the account.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Account storage failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateSeatLimit(accountId: string, activeUsers: number, currentMaxUsers: number) {
    const nextLimit = Number(limitByAccount[accountId] || currentMaxUsers);
    if (!nextLimit || nextLimit < activeUsers) {
      toast.error("Seat limit must be at least active users.");
      return;
    }

    setUpdatingId(accountId);
    try {
      const response = await fetch("/api/admin/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: accountId, maxUsers: nextLimit })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to update seat limit.");
      }

      toast.success("Seat limit updated.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Seat limit update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold">Credential vault</h2>
      <p className="mt-1 text-sm text-muted-foreground">Encrypted account inventory with seat-capacity tracking.</p>
      {lowStockCount > 0 ? (
        <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
          Stock alert: {lowStockCount} account pool(s) are low on remaining seats.
        </div>
      ) : null}
      <form action={createAccount} className="mt-5 grid gap-4">
        <select name="productId" className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5">
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="provider" placeholder="Netflix" required />
          <Input name="label" placeholder="Netflix Family Pool A" required />
          <Input name="email" type="email" placeholder="vault@example.com" required />
          <Input name="password" type="password" placeholder="Credential password" required />
          <Input name="maxUsers" type="number" placeholder="Max users" required />
        </div>
        <Button disabled={submitting}>{submitting ? "Encrypting..." : "Store OTT account"}</Button>
      </form>
      <div className="mt-6">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search account pools" />
      </div>
      <div className="mt-4 space-y-3">
        {filteredAccounts.map((account) => {
          const usagePct = account.maxUsers > 0 ? Math.min((account.activeUsers / account.maxUsers) * 100, 100) : 0;
          return (
            <div key={account.id} className="rounded-2xl border border-border/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{account.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{account.provider}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${account.status === "available" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : account.status === "full" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-slate-500/10 text-slate-700 dark:text-slate-300"}`}>
                  {account.status}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Active seats {account.activeUsers}/{account.maxUsers}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usagePct}%` }} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="number"
                  min={account.activeUsers || 1}
                  value={limitByAccount[account.id] ?? String(account.maxUsers)}
                  onChange={(event) =>
                    setLimitByAccount((current) => ({
                      ...current,
                      [account.id]: event.target.value
                    }))
                  }
                  placeholder="Seat limit"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatingId === account.id}
                  onClick={() => updateSeatLimit(account.id, account.activeUsers, account.maxUsers)}
                >
                  {updatingId === account.id ? "..." : "Update limit"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
