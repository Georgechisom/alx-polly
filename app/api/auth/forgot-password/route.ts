import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRouteClient } from "@/lib/supabase/server-client";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const supabase = await createRouteClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.nextUrl.origin}/reset-password`,
    });

    if (error) {
      console.error("Forgot password error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing your request" },
        { status: 500 }
      );
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
