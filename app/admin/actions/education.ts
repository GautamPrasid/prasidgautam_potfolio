"use server";

import { getActionClient, triggerRevalidateAll } from "./_shared";

export async function saveEducationAction(payload: {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  status: string;
  description: string;
  courses?: string[];
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("edu-")) {
    result = await supabase
      .from("education")
      .update({ degree: payload.degree, institution: payload.institution, location: payload.location, duration: payload.duration, status: payload.status, description: payload.description, courses: payload.courses ?? [], updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("education")
      .insert([{ degree: payload.degree, institution: payload.institution, location: payload.location, duration: payload.duration, status: payload.status, description: payload.description, courses: payload.courses ?? [], order_index: payload.order_index ?? 0 }])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteEducationAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
  triggerRevalidateAll();
  return { success: true };
}

export async function reorderEducationAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(updates.map((u) => supabase.from("education").update({ order_index: u.order_index }).eq("id", u.id)));
  triggerRevalidateAll();
  return { success: true };
}
