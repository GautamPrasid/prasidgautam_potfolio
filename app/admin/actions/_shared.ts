import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function getActionClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

export function triggerRevalidateAll() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin");
  } catch (err) {
    console.error("Revalidation error:", err);
  }
}
