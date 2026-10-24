"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon, MessageCircle } from "lucide-react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

interface BlogShareBarProps {
  title: string;
  slug: string;
}

export function BlogShareBar({ title, slug }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://www.prasidgautam.com.np/blog/${slug}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const url = encodeURIComponent(getFullUrl());
  const text = encodeURIComponent(`Check out "${title}" by Prasid Gautam`);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Share2 className="w-4 h-4 text-primary" />
        <span>Share this article</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy article link to clipboard"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-all min-h-[44px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (formerly Twitter)"
          className="p-2.5 rounded-xl bg-muted hover:bg-[#1da1f2]/10 hover:text-[#1da1f2] text-foreground transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent hover:border-[#1da1f2]/30"
        >
          <DynamicIcon name="Twitter" className="w-4 h-4" />
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="p-2.5 rounded-xl bg-muted hover:bg-[#0077b5]/10 hover:text-[#0077b5] text-foreground transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent hover:border-[#0077b5]/30"
        >
          <DynamicIcon name="Linkedin" className="w-4 h-4" />
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="p-2.5 rounded-xl bg-muted hover:bg-[#25d366]/10 hover:text-[#25d366] text-foreground transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent hover:border-[#25d366]/30"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
