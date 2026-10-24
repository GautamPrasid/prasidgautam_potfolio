"use client";

import { useEffect } from "react";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 antialiased font-sans">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Service Temporarily Unavailable
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              We encountered a temporary connection issue. Your experience will restore as soon as the service reconnects.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700/60"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </a>
          </div>

          {error.digest && (
            <p className="text-xs text-slate-500 font-mono">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
