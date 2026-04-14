"use client";

import { useMemo, useState } from "react";
import { Search, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { AppUser } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserBalanceManager({ users }: { users: AppUser[] }) {
  const [query, setQuery] = useState("");
  const [amountByUser, setAmountByUser] = useState<Record<string, string>>({});
  const [actionByUser, setActionByUser] = useState<Record<string, "add" | "deduct">>({});
  const [submittingUserId, setSubmittingUserId] = useState<string | null>(null);
  const [suspendingUserId, setSuspendingUserId] = useState<string | null>(null);
  const [confirmSuspensionUser, setConfirmSuspensionUser] = useState<AppUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.email} ${user.id}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  async function addBalance(userId: string) {
    const amount = Number(amountByUser[userId] || "0");
    const action = actionByUser[userId] || "add";
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    setSubmittingUserId(userId);
    try {
      const response = await fetch("/api/admin/users/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, action })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to add balance.");
      }

      toast.success(action === "deduct" ? "Balance deducted." : "Balance added.");
      setAmountByUser((current) => ({ ...current, [userId]: "" }));
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Balance update failed.");
    } finally {
      setSubmittingUserId(null);
    }
  }

  async function toggleSuspension(user: AppUser) {
    const isSuspending = !user.suspended;
    setSuspendingUserId(user.id);
    try {
      const response = await fetch("/api/admin/users/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, suspend: isSuspending })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to alter suspension status.");

      toast.success(isSuspending ? "User suspended." : "User unsuspended.");
      setConfirmSuspensionUser(null);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setSuspendingUserId(null);
    }
  }

  return (
    <Card className="xl:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">All registered users and wallet</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{users.length} users</p>
      </div>
      <div className="mt-4 relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by email or uid" className="pl-10" />
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-border/80">
        <div className="grid grid-cols-[1fr_0.5fr_1fr_0.5fr] gap-3 bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <p>User</p>
          <p>Balance</p>
          <p>Wallet action</p>
          <p className="text-right">Status</p>
        </div>
        <div className="max-h-[24rem] divide-y divide-border/70 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`grid grid-cols-[1fr_0.5fr_1fr_0.5fr] items-center gap-3 px-4 py-3 ${user.suspended ? "bg-rose-500/5" : ""}`}>
              <div>
                <p className={`truncate text-sm font-medium ${user.suspended ? "text-rose-600 dark:text-rose-400 line-through opacity-70" : ""}`}>
                  {user.email || "unknown"}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user.id}</p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(user.walletBalance || 0)}</p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={amountByUser[user.id] || ""}
                  onChange={(event) => setAmountByUser((current) => ({ ...current, [user.id]: event.target.value }))}
                  placeholder="Amount"
                />
                <select
                  value={actionByUser[user.id] || "add"}
                  onChange={(event) =>
                    setActionByUser((current) => ({
                      ...current,
                      [user.id]: event.target.value as "add" | "deduct"
                    }))
                  }
                  className="h-10 rounded-xl border border-border/80 bg-white/80 px-3 text-sm dark:bg-white/5"
                >
                  <option value="add">Add</option>
                  <option value="deduct">Deduct</option>
                </select>
                <Button type="button" disabled={submittingUserId === user.id} onClick={() => addBalance(user.id)}>
                  {submittingUserId === user.id ? "..." : "Apply"}
                </Button>
              </div>
              <div className="flex justify-end">
                {user.suspended ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 gap-1.5 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                    disabled={suspendingUserId === user.id}
                    onClick={() => setConfirmSuspensionUser(user)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Unsuspend
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 gap-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600"
                    disabled={suspendingUserId === user.id}
                    onClick={() => setConfirmSuspensionUser(user)}
                  >
                    <Ban className="h-4 w-4" />
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 ? <p className="px-4 py-8 text-center text-sm text-muted-foreground">No users found. Users appear after signup/login.</p> : null}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmSuspensionUser)}
        title={confirmSuspensionUser?.suspended ? "Unsuspend user?" : "Suspend user?"}
        description={
          confirmSuspensionUser
            ? `Are you sure you want to ${confirmSuspensionUser.suspended ? "unsuspend" : "suspend"} ${confirmSuspensionUser.email || "this user"}?`
            : ""
        }
        confirmLabel={confirmSuspensionUser?.suspended ? "Yes, unsuspend" : "Yes, suspend"}
        cancelLabel="No"
        tone="default"
        busy={Boolean(confirmSuspensionUser && suspendingUserId === confirmSuspensionUser.id)}
        onCancel={() => setConfirmSuspensionUser(null)}
        onConfirm={() => {
          if (confirmSuspensionUser) {
            void toggleSuspension(confirmSuspensionUser);
          }
        }}
      />
    </Card>
  );
}
