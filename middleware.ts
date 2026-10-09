import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const { supabase, response } = createClient(request);

  if (!supabase) {
    if (!isLoginPage) {
      const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c));
      return redirectResponse;
    }
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (admin) {
      isAdmin = true;
    }
  }

  if (!user || !isAdmin) {
    if (!isLoginPage) {
      const errorParam = user && !isAdmin ? "?error=unauthorized" : "";
      const redirectResponse = NextResponse.redirect(new URL(`/admin/login${errorParam}`, request.url));
      response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c));
      return redirectResponse;
    }
    return response;
  }

  if (isLoginPage) {
    const redirectResponse = NextResponse.redirect(new URL("/admin", request.url));
    response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value, c));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
