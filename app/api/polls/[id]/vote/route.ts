import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server-client";
import { z } from "zod";

const voteSchema = z.object({
  optionId: z.string().uuid("Invalid option ID"),
});

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createRouteClient();
    const pollId = params.id;
    const body = await request.json();
    const { optionId } = voteSchema.parse(body);

    // Get user (optional for anonymous voting)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get client IP for anonymous voting
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("*")
      .eq("id", pollId)
      .single();

    if (pollError) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json({ error: "Poll has expired" }, { status: 400 });
    }

    // Check if option belongs to this poll
    const { data: option, error: optionError } = await supabase
      .from("poll_options")
      .select("*")
      .eq("id", optionId)
      .eq("poll_id", pollId)
      .single();

    if (optionError) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    // Check for existing vote (prevent duplicate voting)
    if (user) {
      const { data: existingVote } = await supabase
        .from("votes")
        .select("id")
        .eq("poll_id", pollId)
        .eq("user_id", user.id)
        .single();

      if (existingVote && !poll.allow_multiple_votes) {
        return NextResponse.json(
          { error: "You have already voted on this poll" },
          { status: 400 }
        );
      }
    }

    // Record the vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: user?.id || null,
        voter_ip: user ? null : clientIP, // Only store IP for anonymous votes
      })
      .select()
      .single();

    if (voteError) {
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }

    // Update poll analytics
    await supabase.rpc("update_poll_analytics", { poll_id: pollId });

    return NextResponse.json(
      {
        message: "Vote recorded successfully",
        vote,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
