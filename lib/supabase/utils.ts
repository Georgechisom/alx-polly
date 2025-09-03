import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createClient(cookieStore);
}

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
