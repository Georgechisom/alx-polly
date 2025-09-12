import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server-client";
import { z } from "zod";

const createPollSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().optional(),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required"),
  allowMultipleVotes: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
  isPublic: z.boolean().default(true),
});

async function getPollsData(skip: number = 0, limit: number = 10) {
  const supabase = await createRouteClient();
  const { data: polls, error } = await supabase
    .from("polls")
    .select(
      `
      *,
      poll_options (*)
    `
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .order("order_index", { foreignTable: "poll_options", ascending: true })
    .range(skip, skip + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return { polls: polls || [] };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const data = await getPollsData(skip, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function createPollData(request: NextRequest) {
  const supabase = await createRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  const body = await request.json();
  const validatedData = createPollSchema.parse(body);

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({
      title: validatedData.title,
      description: validatedData.description,
      creator_id: user.id,
      allow_multiple_votes: validatedData.allowMultipleVotes,
      expires_at: validatedData.expiresAt,
      is_public: validatedData.isPublic,
    })
    .select()
    .single();

  if (pollError) {
    console.error("Error creating poll:", pollError);
    return { error: "Error creating poll", status: 500 };
  }

  const optionsToInsert = validatedData.options.map((optionText, index) => ({
    text: optionText,
    poll_id: poll.id,
    order_index: index,
  }));

  const { error: optionsError } = await supabase
    .from("poll_options")
    .insert(optionsToInsert);

  if (optionsError) {
    console.error("Error creating poll options:", optionsError);
    await supabase.from("polls").delete().eq("id", poll.id);
    return { error: "Error creating poll options", status: 500 };
  }

  const { data: createdOptions, error: fetchOptionsError } = await supabase
    .from("poll_options")
    .select("id, text, order_index")
    .eq("poll_id", poll.id);

  if (fetchOptionsError) {
    console.error("Error fetching created poll options:", fetchOptionsError);
  }

  return {
    data: { ...poll, options: createdOptions || [] },
    status: 201,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { data, error, status } = await createPollData(request);

    if (error) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json({ poll: data }, { status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
