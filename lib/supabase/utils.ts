import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function createSupabaseServerClient() {
  return await createServerSupabaseClient();
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
