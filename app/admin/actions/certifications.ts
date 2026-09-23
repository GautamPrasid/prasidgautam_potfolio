"use server";

import { getActionClient, triggerRevalidateAll } from "./_shared";

export async function saveCertificationAction(payload: {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  credential_url: string;
  skills: string[];
  issuer_color?: string;
  order_index?: number;
}) {
  const supabase = await getActionClient();
  let result;

  if (payload.id && !payload.id.startsWith("cert-")) {
    result = await supabase
      .from("certifications")
      .update({ title: payload.title, issuer: payload.issuer, date: payload.date, credential_url: payload.credential_url, skills: payload.skills, issuer_color: payload.issuer_color, updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("certifications")
      .insert([{ title: payload.title, issuer: payload.issuer, date: payload.date, credential_url: payload.credential_url, skills: payload.skills, issuer_color: payload.issuer_color, order_index: payload.order_index ?? 0 }])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  triggerRevalidateAll();
  return { success: true, data: result.data };
}

export async function deleteCertificationAction(id: string) {
  const supabase = await getActionClient();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  triggerRevalidateAll();
  return { success: true };
}

export async function reorderCertificationsAction(updates: { id: string; order_index: number }[]) {
  const supabase = await getActionClient();
  await Promise.all(updates.map((u) => supabase.from("certifications").update({ order_index: u.order_index }).eq("id", u.id)));
  triggerRevalidateAll();
  return { success: true };
}
