import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRouteClient } from "@/lib/supabase/server-client";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = resetPasswordSchema.parse(body);

    const supabase = await createRouteClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Reset password error:", error);
      return NextResponse.json(
        {
          error: "Failed to update password. The reset link may have expired.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid password format" },
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
