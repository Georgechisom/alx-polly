"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreatePollButton() {
  return (
    <Button asChild className="hover-glow transition-smooth">
      <Link href="/polls/create">
        <Plus className="mr-2 h-4 w-4" />
        Create Poll
      </Link>
    </Button>
  );
}
