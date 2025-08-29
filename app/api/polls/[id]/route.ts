import { NextRequest, NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/server-client";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const pollId = params.id;

    // For now, return mock data to test the frontend
    // TODO: Implement proper Supabase integration once auth is working
    const mockPolls: Record<string, any> = {
      "1": {
        id: "1",
        title: "What's your favorite programming language?",
        description: "Help us understand the community preferences",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        expires_at: null,
        is_public: true,
        allow_multiple_votes: false,
        creator_id: "mock-user-id",
        options: [
          { id: "opt-1", text: "JavaScript", votes: 45 },
          { id: "opt-2", text: "Python", votes: 38 },
          { id: "opt-3", text: "TypeScript", votes: 32 },
          { id: "opt-4", text: "Go", votes: 15 },
          { id: "opt-5", text: "Rust", votes: 12 },
        ],
      },
      "2": {
        id: "2",
        title: "Best time for team meetings?",
        description: "Let's find the optimal meeting time",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        expires_at: new Date(Date.now() + 604800000).toISOString(),
        is_public: false,
        allow_multiple_votes: true,
        creator_id: "mock-user-id",
        options: [
          { id: "opt-1", text: "9:00 AM", votes: 12 },
          { id: "opt-2", text: "10:00 AM", votes: 25 },
          { id: "opt-3", text: "2:00 PM", votes: 18 },
          { id: "opt-4", text: "3:00 PM", votes: 8 },
        ],
      },
    };

    const poll = mockPolls[pollId];

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    return NextResponse.json({ poll });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pollId = params.id;
    const body = await request.json();

    // Check if user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("creator_id")
      .eq("id", pollId)
      .single();

    if (pollError || poll.creator_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // TODO: Implement poll update logic
    const { data: updatedPoll, error: updateError } = await supabase
      .from("polls")
      .update({
        title: body.title,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pollId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ poll: updatedPoll });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createRouteClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pollId = params.id;

    // Check if user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("creator_id")
      .eq("id", pollId)
      .single();

    if (pollError || poll.creator_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // TODO: Implement poll deletion logic
    const { error: deleteError } = await supabase
      .from("polls")
      .delete()
      .eq("id", pollId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Poll deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
