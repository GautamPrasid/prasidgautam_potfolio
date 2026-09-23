"use server";

import { getActionClient, triggerRevalidateAll } from "./_shared";

export async function saveSocialLinkAction(payload: {
  id?: string;
  platform: string;
  url: string;
  icon_name: string;
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("social-")) {
    result = await supabase
      .from("social_links")
      .update({
        platform: payload.platform,
        url: payload.url,
        icon_name: payload.icon_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("social_links")
      .insert([{ platform: payload.platform, url: payload.url, icon_name: payload.icon_name, order_index: payload.order_index ?? 0 }])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteSocialLinkAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  triggerRevalidateAll();
  return { success: true };
}

export async function reorderSocialLinksAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(updates.map((u) => supabase.from("social_links").update({ order_index: u.order_index }).eq("id", u.id)));
  triggerRevalidateAll();
  return { success: true };
}
