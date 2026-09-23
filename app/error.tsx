"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <AlertTriangle className="w-12 h-12" />
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
          Something went wrong
        </h1>
        <p className="text-muted-foreground text-sm">
          An unexpected error occurred. Please click below to reload the section.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
