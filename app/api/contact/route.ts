import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

/**
 * In-memory rate limiter.
 *
 * NOTE: On Vercel (and any serverless platform) each function invocation may
 * run in a separate process or container. This Map persists only for the
 * lifetime of a single warm instance, so it does NOT reliably enforce the
 * limit across all concurrent instances. It is still useful as a basic
 * defence (most traffic hits the same warm instance back-to-back), but for
 * strict enforcement you should replace it with an upstash/redis counter.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const ipHits = new Map<string, number[]>();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipHits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    ipHits.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipHits.set(ip, timestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: bots fill this hidden field; humans never see it.
    const website = typeof body.website === "string" ? body.website.trim() : "";
    if (website) {
      return NextResponse.json({ success: true, message: "Message received." }, { status: 200 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 1 || name.length > 100) {
      return NextResponse.json({ error: "Name must be between 1 and 100 characters." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email) || email.length < 3 || email.length > 254) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    if (subject.length < 1 || subject.length > 150) {
      return NextResponse.json({ error: "Subject must be between 1 and 150 characters." }, { status: 400 });
    }
    if (message.length < 1 || message.length > 2000) {
      return NextResponse.json({ error: "Message must be between 1 and 2000 characters." }, { status: 400 });
    }

    let supabase;
    try {
      supabase = createAdminClient();
    } catch {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    const { error } = await supabase.from("messages").insert([{ name, email, subject, message }]);

    if (error) {
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Thank you! Your message has been sent." }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
