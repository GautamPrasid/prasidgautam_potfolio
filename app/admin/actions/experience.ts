"use server";

import { getActionClient, triggerRevalidateAll } from "./_shared";

export async function saveExperienceAction(payload: {
  id?: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  bullets: string[];
  technologies: string[];
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("exp-")) {
    result = await supabase
      .from("experience")
      .update({ role: payload.role, company: payload.company, location: payload.location, duration: payload.duration, type: payload.type, bullets: payload.bullets, technologies: payload.technologies, updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("experience")
      .insert([{ role: payload.role, company: payload.company, location: payload.location, duration: payload.duration, type: payload.type, bullets: payload.bullets, technologies: payload.technologies, order_index: payload.order_index ?? 0 }])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteExperienceAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  triggerRevalidateAll();
  return { success: true };
}

export async function reorderExperienceAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(updates.map((u) => supabase.from("experience").update({ order_index: u.order_index }).eq("id", u.id)));
  triggerRevalidateAll();
  return { success: true };
}
