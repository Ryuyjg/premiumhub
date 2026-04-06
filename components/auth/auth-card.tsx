"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { getClientAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  async function persistSession() {
    const auth = getClientAuth();
    if (!auth) {
      throw new Error("Firebase client configuration missing.");
    }

    const token = await auth.currentUser?.getIdToken();
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      throw new Error("Unable to start secure session.");
    }
  }

  async function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setLoading(true);
    try {
      if (mode === "login") {
        const adminLoginResponse = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (adminLoginResponse.ok) {
          toast.success("Admin access granted.");
          router.push("/admin");
          router.refresh();
          return;
        }
      }

      const auth = getClientAuth();
      if (!auth) {
        throw new Error("Firebase client configuration missing.");
      }

      if (mode === "register") {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(credentials.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      await persistSession();
      toast.success(mode === "register" ? "Account created." : "Welcome back.");
      router.push(searchParams.get("redirect") || "/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      if (message.includes("Firebase client configuration")) {
        toast.error("Firebase is not configured in deployment. Add NEXT_PUBLIC_FIREBASE_* env variables in Vercel.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-shell w-full max-w-lg overflow-hidden p-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Secure access</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === "login" ? "Sign in to manage subscriptions." : "Create your customer account."}
        </h1>
        <p className="text-muted-foreground">Firebase Auth powers secure login, account access, and protected purchases.</p>
      </div>
      <form action={handleSubmit} className="space-y-4">
        {mode === "register" ? <Input name="name" placeholder="Full name" required /> : null}
        <Input name="email" type="email" placeholder="Email address" required />
        <Input name="password" type="password" placeholder="Password" required minLength={6} />
        <Button className="h-12 w-full" disabled={loading}>
          {loading ? "Securing account..." : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-6 text-sm text-muted-foreground"
      >
        {mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
