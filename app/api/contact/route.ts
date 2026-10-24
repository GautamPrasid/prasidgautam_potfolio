import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

/**
 * Contact Form Abuse Protection:
 * 1. Request body capped at 10KB to prevent memory exhaustion attacks.
 * 2. Trusted proxy header resolution (x-vercel-forwarded-for, cf-connecting-ip, x-real-ip)
 *    to prevent client IP spoofing.
 * 3. L1 in-memory IP rate limiter for instant burst protection.
 * 4. L2 shared database-backed rate limiter (via Supabase messages table)
 *    that persists and enforces limits across all stateless Vercel serverless instances.
 * 5. Bot protection: honeypot field + minimum human interaction timing check.
 * 6. Server-side sanitization: control character stripping, link count limits, RFC email validation.
 */

const MAX_BODY_BYTES = 10 * 1024; // 10 KB cap
const IP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const IP_MAX_REQUESTS = 5;
const DB_EMAIL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DB_EMAIL_MAX = 3;
const DB_GLOBAL_BURST_MS = 60 * 1000; // 1 minute
const DB_GLOBAL_BURST_MAX = 12;

// In-memory L1 rate limiter (persists during warm serverless instance lifetime)
const ipHits = new Map<string, number[]>();

// Strict RFC 5322 compliant email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Resolve client IP using edge-verified headers.
 * Does NOT blindly trust client-supplied x-forwarded-for headers.
 */
function getClientIp(request: Request): string {
  // 1. Vercel Edge proxy header (cannot be forged by the client)
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  // 2. Cloudflare Connecting IP
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  // 3. Trusted Real IP header
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // 4. Fallback: x-forwarded-for. When multiple proxies exist, the closest upstream
  // proxy appends to the end of the list. Take the last valid IP to prevent client-injected spoofing.
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);
    if (ips.length > 0) {
      return ips[ips.length - 1];
    }
  }

  return "unknown";
}

/**
 * L1 in-memory rate check per IP address
 */
function checkInMemoryIpRateLimit(ip: string): boolean {
  if (ip === "unknown") return false;
  const now = Date.now();
  const timestamps = (ipHits.get(ip) ?? []).filter((time) => now - time < IP_WINDOW_MS);
  if (timestamps.length >= IP_MAX_REQUESTS) {
    ipHits.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipHits.set(ip, timestamps);
  return false;
}

/**
 * Strip dangerous ASCII control characters and null bytes
 */
function sanitizeString(str: string): string {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
}

export async function POST(request: Request) {
  try {
    // 1. Cap request body size via Content-Length header
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload too large. Request body cannot exceed 10KB." },
        { status: 413 }
      );
    }

    // 2. Enforce JSON content type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected application/json." },
        { status: 415 }
      );
    }

    // 3. Read raw body and enforce byte cap even if Content-Length header was omitted
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload too large. Request body cannot exceed 10KB." },
        { status: 413 }
      );
    }

    // 4. Safe JSON parse
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON payload." },
        { status: 400 }
      );
    }

    // 5. Bot Check: Honeypot field
    // Bots fill hidden inputs; humans never see or interact with them.
    // Return synthetic 200 so bots cannot discern they were caught.
    const website = typeof body.website === "string" ? sanitizeString(body.website) : "";
    if (website) {
      return NextResponse.json(
        { success: true, message: "Thank you! Your message has been sent." },
        { status: 200 }
      );
    }

    // 6. Bot Check: Interaction timing check
    // If the client submits faster than a human could physically type (under 1200ms)
    // or with a nonsensical future timestamp, silently absorb it.
    if (body._t !== undefined) {
      const formTimestamp = Number(body._t);
      if (!isNaN(formTimestamp)) {
        const elapsed = Date.now() - formTimestamp;
        if (elapsed < 1200 || elapsed < 0) {
          return NextResponse.json(
            { success: true, message: "Thank you! Your message has been sent." },
            { status: 200 }
          );
        }
      }
    }

    // 7. L1 In-Memory Rate Limiting
    const ip = getClientIp(request);
    if (checkInMemoryIpRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests from your connection. Please wait a few minutes." },
        { status: 429 }
      );
    }

    // 8. Sanitize and validate inputs
    const name = typeof body.name === "string" ? sanitizeString(body.name) : "";
    const email = typeof body.email === "string" ? sanitizeString(body.email).toLowerCase() : "";
    const subject = typeof body.subject === "string" ? sanitizeString(body.subject) : "";
    const message = typeof body.message === "string" ? sanitizeString(body.message) : "";

    if (name.length < 1 || name.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 1 and 100 characters." },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email) || email.length < 5 || email.length > 254) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }
    if (subject.length < 1 || subject.length > 150) {
      return NextResponse.json(
        { error: "Subject must be between 1 and 150 characters." },
        { status: 400 }
      );
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 2000 characters." },
        { status: 400 }
      );
    }

    // Anti-Spam: Disallow messages with excessive links (> 3 URLs)
    const urlMatches = message.match(/https?:\/\/[^\s]+/gi) || [];
    if (urlMatches.length > 3) {
      return NextResponse.json(
        { error: "Messages may not contain more than 3 links." },
        { status: 400 }
      );
    }

    // 9. Database Client Initialization
    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json(
        { error: "Database configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // 10. L2 Shared Rate Limiting (Persistent across all Vercel serverless instances)
    // a. Check recent submissions from the same email in the last 10 minutes
    const emailWindowStart = new Date(Date.now() - DB_EMAIL_WINDOW_MS).toISOString();
    const { count: recentEmailCount, error: emailCountErr } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", emailWindowStart);

    if (!emailCountErr && recentEmailCount !== null && recentEmailCount >= DB_EMAIL_MAX) {
      return NextResponse.json(
        { error: "Too many messages sent from this email address. Please try again in 10 minutes." },
        { status: 429 }
      );
    }

    // b. Global burst protection across all instances (max 12 messages / 60 seconds)
    const burstWindowStart = new Date(Date.now() - DB_GLOBAL_BURST_MS).toISOString();
    const { count: globalBurstCount, error: burstCountErr } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .gte("created_at", burstWindowStart);

    if (!burstCountErr && globalBurstCount !== null && globalBurstCount >= DB_GLOBAL_BURST_MAX) {
      return NextResponse.json(
        { error: "High traffic volume. Please try again in a few moments." },
        { status: 429 }
      );
    }

    // 11. Insert message into Supabase
    const { error: insertError } = await supabase
      .from("messages")
      .insert([{ name, email, subject, message }]);

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Thank you! Your message has been sent." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
