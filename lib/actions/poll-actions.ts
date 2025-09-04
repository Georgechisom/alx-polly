"use server";

import { z } from "zod";
import { Poll, PollWithOptions } from "../types/poll";
import { createSupabaseServerClient, getCurrentUser } from "../supabase/utils";

const pollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  options: z
    .array(z.object({ text: z.string().min(1, "Option text cannot be empty") }))
    .min(2, "At least two options are required"),
});

export type PollInput = z.infer<typeof pollSchema>;

async function validateAndAuthenticate() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}

export async function createPoll(
  input: PollInput
): Promise<{ data?: Poll; error?: string }> {
  try {
    const user = await validateAndAuthenticate();
    const validation = pollSchema.safeParse(input);

    if (!validation.success) {
      return { error: validation.error.message };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("polls")
      .insert({
        title: input.title,
        creator_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    const pollOptions = input.options.map((option, index) => ({
      text: option.text,
      poll_id: data.id,
      order_index: index,
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(pollOptions);

    if (optionsError) {
      return { error: optionsError.message };
    }

    return { data };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function getPoll(
  id: string
): Promise<{ data?: PollWithOptions; error?: string }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("polls")
      .select(
        `
        *,
        poll_options (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return { error: error.message };
    }

    return {
      data: {
        ...data,
        options: data.poll_options || []
      }
    };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deletePoll(
  pollId: string
): Promise<{ success: boolean; error?: string }> {
  if (!pollId) {
    return { success: false, error: "Poll ID is required" };
  }

  try {
    await validateAndAuthenticate();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("polls").delete().eq("id", pollId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
