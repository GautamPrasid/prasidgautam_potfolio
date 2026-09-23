"use server";

import { revalidatePath } from "next/cache";
import { getActionClient } from "./_shared";

export async function toggleMessageReadAction(id: string, is_read: boolean) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("messages").update({ is_read }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
  return { success: true };
}
