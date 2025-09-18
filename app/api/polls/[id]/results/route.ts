import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server-client";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createRouteClient();
    const pollId = params.id;

    // Get poll with options and vote counts
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select(
        `
        *,
        poll_options (*)
      `
      )
      .eq("id", pollId)
      .single();

    if (pollError) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Check if poll is public or user owns it
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!poll.is_public && poll.creator_id !== user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ poll });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
