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

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data to test the frontend
    // TODO: Implement proper Supabase integration once auth is working
    const mockPolls = [
      {
        id: "1",
        title: "What's your favorite programming language?",
        description: "Help us understand the community preferences",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        expires_at: null,
        is_public: true,
        allow_multiple_votes: false,
        creator_id: "mock-user-id",
      },
      {
        id: "2",
        title: "Best time for team meetings?",
        description: "Let's find the optimal meeting time",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        expires_at: new Date(Date.now() + 604800000).toISOString(),
        is_public: false,
        allow_multiple_votes: true,
        creator_id: "mock-user-id",
      },
    ];

    return NextResponse.json({ polls: mockPolls });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function getPollsData() {
  // core logic returns plain JS objects (no Response)
  const polls = [
    /* ... */
  ];
  return polls;
}

export default async function handler(req: Request) {
  try {
    const polls = await getPollsData();
    return new Response(JSON.stringify(polls), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "..." }), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createPollSchema.parse(body);

    // TODO: This should be a transaction. Using an RPC function in Supabase is the recommended way.
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
      return NextResponse.json(
        { error: "Error creating poll" },
        { status: 500 }
      );
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
      // Clean up the created poll if options insertion fails
      await supabase.from("polls").delete().eq("id", poll.id);
      return NextResponse.json(
        { error: "Error creating poll options" },
        { status: 500 }
      );
    }

    // Fetch the newly created options to return them with the poll
    const { data: createdOptions, error: fetchOptionsError } = await supabase
      .from("poll_options")
      .select("id, text, order_index")
      .eq("poll_id", poll.id);

    if (fetchOptionsError) {
      // Log the error but proceed with returning the poll data, as the creation was successful
      console.error("Error fetching created poll options:", fetchOptionsError);
    }

    const responseData = { ...poll, options: createdOptions || [] };

    return NextResponse.json({ poll: responseData }, { status: 201 });
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
