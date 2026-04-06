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

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) =>
      `${account.provider} ${account.label} ${account.status}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [accounts, query]);

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

  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold">Credential vault</h2>
      <p className="mt-1 text-sm text-muted-foreground">Encrypted account inventory with seat-capacity tracking.</p>
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
            </div>
          );
        })}
      </div>
    </Card>
  );
}
