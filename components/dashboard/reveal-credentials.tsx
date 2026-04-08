"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Eye, EyeOff, Loader2, Lock, ShieldCheck, Zap } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  async function handleReveal() {
    setLoading(true);
    try {
      const startTime = Date.now();
      const response = await fetch(`/api/subscriptions/${subscriptionId}/credentials`);
      const payload = await response.json();

      const elapsed = Date.now() - startTime;
      if (elapsed < 1200) {
        await new Promise((resolve) => setTimeout(resolve, 1200 - elapsed));
      }

      if (!response.ok) {
        throw new Error(payload.error || "Unable to reveal credentials.");
      }

      setCredentials(payload);
      toast.success(payload.mode === "direct_credentials" ? "Credentials loaded successfully." : "Delivery update loaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Credential reveal failed.");
    } finally {
      setLoading(false);
    }
  }

  async function copyValue(value: string, field: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error(`Unable to copy ${field.toLowerCase()}.`);
    }
  }

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {!credentials ? (
          <motion.div
            key="reveal-button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleReveal}
              className={`relative h-10 w-full overflow-hidden rounded-xl border-primary/20 bg-primary/5 font-semibold text-primary transition-all hover:bg-primary/10 hover:shadow-md ${
                loading ? "cursor-wait" : ""
              }`}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Opening delivery details...</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4 fill-primary/20" />
                    View delivery details
                  </motion.span>
                )}
              </AnimatePresence>

              {loading ? (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              ) : null}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="credentials-card"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 150 }}
            className="section-shell relative overflow-hidden rounded-2xl p-4"
          >
            <div className="absolute -top-12 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />

            <div className="relative mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{credentials.provider}</p>
                  <p className="text-sm font-semibold">{credentials.label}</p>
                </div>
              </div>
              <div className="flex h-6 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                READY
              </div>
            </div>

            <div className="space-y-3">
              {credentials.mode === "direct_credentials" ? (
                <>
                  <div className="group relative">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Account ID / Email</p>
                    <div className="flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-border/50 bg-muted/40 p-2 pl-3 transition-colors hover:border-primary/30">
                      <p className="select-all truncate font-mono text-xs">{credentials.email}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 transition-colors hover:bg-primary/10 hover:text-primary"
                        onClick={() => copyValue(credentials.email, "Email")}
                      >
                        {copiedField === "Email" ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="group relative">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">Secure Password</p>
                    <div className="flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-border/50 bg-muted/40 p-2 pl-3 transition-colors hover:border-primary/30">
                      <p className="select-all truncate font-mono text-xs">
                        {showPassword ? credentials.password : "••••••••••••"}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() => setShowPassword((value) => !value)}
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary"
                          onClick={() => copyValue(credentials.password, "Password")}
                        >
                          {copiedField === "Password" ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Delivery update</p>
                  <p className="mt-2 text-sm font-semibold">{credentials.label}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {credentials.note || "Your delivery details will be shared through the account area shortly."}
                  </p>
                </div>
              )}

              {credentials.note && credentials.mode === "direct_credentials" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-start gap-2 rounded-xl border border-amber-500/10 bg-amber-500/5 p-3 dark:bg-amber-500/10"
                >
                  <Lock className="mt-0.5 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
                    <span className="font-bold">Note:</span> {credentials.note}
                  </p>
                </motion.div>
              ) : null}
            </div>

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
