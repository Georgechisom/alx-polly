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

export async function POST(request: NextRequest) {
  try {
    // For now, return mock data to test the frontend
    // TODO: Implement proper Supabase integration once auth is working
    const body = await request.json();
    const validatedData = createPollSchema.parse(body);

    // Create mock poll response
    const mockPoll = {
      id: Date.now().toString(),
      title: validatedData.title,
      description: validatedData.description,
      creator_id: "mock-user-id",
      is_public: validatedData.isPublic,
      allow_multiple_votes: validatedData.allowMultipleVotes,
      expires_at: validatedData.expiresAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      options: validatedData.options.map((option, index) => ({
        id: `option-${index + 1}`,
        text: option,
        order_index: index,
        votes: 0,
      })),
    };

    return NextResponse.json({ poll: mockPoll }, { status: 201 });
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
