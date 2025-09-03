import { createClient } from "@/lib/supabase/client";

export async function deletePoll(pollId: string) {
  if (!pollId) {
    return { success: false, error: "Poll ID is required" };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("polls").delete().eq("id", pollId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
