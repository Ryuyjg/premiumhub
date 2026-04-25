"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System Route Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6">
      <div className="surface flex max-w-md flex-col items-center gap-6 rounded-[2.5rem] p-10 text-center border-dashed border-2 border-border/80 bg-muted/20">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-500/10 text-rose-500 shadow-inner">
          <AlertTriangle className="h-10 w-10 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black tracking-tight text-foreground">System Disturbance</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We encountered an unexpected issue while loading this view. The disruption has been logged and our system will recover shortly.
          </p>
        </div>
        <Button onClick={() => reset()} className="btn-primary w-full gap-2 mt-2">
          <RefreshCcw className="h-4 w-4" /> Try connecting again
        </Button>
      </div>
    </div>
  );
}
