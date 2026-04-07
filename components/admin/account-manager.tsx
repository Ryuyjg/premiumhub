"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash2, X, Save } from "lucide-react";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ label: "", email: "", password: "" });

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
        provider: String(formData.get("provider")).trim(),
        email: String(formData.get("email")).trim(),
        password: String(formData.get("password")).trim(),
        maxUsers: Number(formData.get("maxUsers")),
        label: String(formData.get("label")).trim()
      };

      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to store account.");
      }

      toast.success("OTT account stored.");
      window.location.reload();
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

  async function submitEditAccount(accountId: string) {
    if (!editForm.label.trim()) {
      toast.error("Label cannot be empty.");
      return;
    }
    setUpdatingId(accountId);
    try {
      const payload: any = { id: accountId, label: editForm.label.trim() };
      if (editForm.email.trim()) payload.email = editForm.email.trim();
      if (editForm.password.trim()) payload.password = editForm.password.trim();

      const response = await fetch("/api/admin/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to update account details.");
      }

      toast.success("Account details updated.");
      setEditingId(null);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Account update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteAccount(accountId: string) {
    if (!window.confirm("Are you sure you want to permanently delete this credential? This cannot be undone.")) return;
    setDeletingId(accountId);
    try {
      const response = await fetch(`/api/admin/accounts?id=${accountId}`, {
        method: "DELETE"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete account.");
      }

      toast.success("Account deleted.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Account deletion failed.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold">Credential vault (v2)</h2>
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
            <div key={account.id} className="rounded-2xl border border-border/80 p-4 transition-all hover:border-primary/20 hover:bg-muted/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {editingId === account.id ? (
                    <Input
                      autoFocus
                      className="h-7 w-full max-w-[200px] text-sm font-semibold p-1 px-2 m-0 h-auto"
                      value={editForm.label}
                      onChange={(e) => setEditForm(s => ({ ...s, label: e.target.value }))}
                      placeholder="Account Label"
                    />
                  ) : (
                    <p className="font-semibold truncate">{account.label}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">{account.provider}</p>
                </div>
                
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${account.status === "available" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : account.status === "full" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-slate-500/10 text-slate-700 dark:text-slate-300"}`}>
                    {account.status}
                  </span>
                  
                  {editingId === account.id ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                      onClick={() => {
                        setEditingId(account.id);
                        setEditForm({ label: account.label, email: "", password: "" });
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                    onClick={() => deleteAccount(account.id)}
                    disabled={deletingId === account.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {editingId === account.id && (
                <div className="mt-4 grid gap-3 animate-in slide-in-from-top-1 fade-in-0 duration-200">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Update sensitive data</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input 
                      placeholder="New email (leave blank to keep current)" 
                      type="email" 
                      className="text-xs h-9"
                      value={editForm.email}
                      onChange={(e) => setEditForm(s => ({ ...s, email: e.target.value }))}
                    />
                    <Input 
                      placeholder="New password (leave blank to keep current)" 
                      type="password" 
                      className="text-xs h-9"
                      value={editForm.password}
                      onChange={(e) => setEditForm(s => ({ ...s, password: e.target.value }))}
                    />
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    className="w-full gap-2 mt-1 h-9"
                    disabled={updatingId === account.id}
                    onClick={() => submitEditAccount(account.id)}
                  >
                    <Save className="h-4 w-4" />
                    {updatingId === account.id ? "Saving..." : "Save details"}
                  </Button>
                  <div className="h-px bg-border/40 w-full my-2" />
                </div>
              )}
              
              <div className={editingId === account.id ? "opacity-40 pointer-events-none" : ""}>
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
            </div>
          );
        })}
      </div>
    </Card>
  );
}
