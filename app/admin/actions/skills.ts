"use server";

import { getActionClient, triggerRevalidateAll } from "./_shared";

export async function saveSkillAction(payload: {
  id?: string;
  name: string;
  category: string;
  icon_name: string;
  level?: number;
  description?: string;
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("skill-")) {
    result = await supabase
      .from("skills")
      .update({ name: payload.name, category: payload.category, icon_name: payload.icon_name, level: payload.level, description: payload.description, updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("skills")
      .insert([{ name: payload.name, category: payload.category, icon_name: payload.icon_name, level: payload.level, description: payload.description, order_index: payload.order_index ?? 0 }])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteSkillAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  triggerRevalidateAll();
  return { success: true };
}

export async function reorderSkillsAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(updates.map((u) => supabase.from("skills").update({ order_index: u.order_index }).eq("id", u.id)));
  triggerRevalidateAll();
  return { success: true };
}
