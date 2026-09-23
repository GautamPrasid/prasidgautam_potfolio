"use server";

import { getActionClient, triggerRevalidateAll } from "./_shared";

export async function saveProjectAction(payload: {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  image?: string | null;
  github?: string | null;
  demo?: string | null;
  category: string;
  featured: boolean;
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("proj-")) {
    result = await supabase
      .from("projects")
      .update({ title: payload.title, description: payload.description, tags: payload.tags, image: payload.image || null, github: payload.github || null, demo: payload.demo || null, category: payload.category, featured: payload.featured, updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("projects")
      .insert([{ title: payload.title, description: payload.description, tags: payload.tags, image: payload.image || null, github: payload.github || null, demo: payload.demo || null, category: payload.category, featured: payload.featured, order_index: payload.order_index ?? 0 }])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteProjectAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  triggerRevalidateAll();
  return { success: true };
}

export async function reorderProjectsAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(updates.map((u) => supabase.from("projects").update({ order_index: u.order_index }).eq("id", u.id)));
  triggerRevalidateAll();
  return { success: true };
}
