"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase font-semibold tracking-wider text-slate-300">
            {language || "code"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet to clipboard"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-sans min-h-[32px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function BlogPostContent({ content }: { content: string }) {
  if (!content) return null;

  // Split content by code fences (```lang ... ```)
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6 text-foreground text-base sm:text-lg leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const firstLineBreak = part.indexOf("\n");
          const language = part.slice(3, firstLineBreak !== -1 ? firstLineBreak : 3).trim();
          const code = firstLineBreak !== -1 ? part.slice(firstLineBreak + 1, -3).trim() : part.slice(3, -3).trim();
          return <CodeBlock key={index} language={language} code={code} />;
        }

        // Parse regular markdown headings, quotes, and paragraphs
        const paragraphs = part.split("\n\n");
        return (
          <div key={index} className="space-y-4">
            {paragraphs.map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // H2 Header
              if (trimmed.startsWith("## ")) {
                return (
                  <h2
                    key={pIdx}
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight pt-6 pb-1 border-b border-border/60"
                  >
                    {trimmed.replace(/^##\s+/, "")}
                  </h2>
                );
              }

              // H3 Header
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={pIdx}
                    className="font-heading font-bold text-xl sm:text-2xl text-foreground tracking-tight pt-4"
                  >
                    {trimmed.replace(/^###\s+/, "")}
                  </h3>
                );
              }

              // Blockquote
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={pIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-primary/5 border-l-4 border-primary text-muted-foreground italic text-base sm:text-lg"
                  >
                    {trimmed.replace(/^>\s+/, "")}
                  </blockquote>
                );
              }

              // Bullet points
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "));
                return (
                  <ul key={pIdx} className="space-y-2 list-disc list-inside text-muted-foreground pl-2">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        {item.replace(/^[-*]\s+/, "")}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Standard paragraph
              return (
                <p key={pIdx} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {trimmed}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
