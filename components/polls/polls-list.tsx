"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: Replace with actual poll type
interface Poll {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  is_public: boolean;
  vote_count?: number;
}

export function PollsList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("/api/polls");
        if (response.ok) {
          const data = await response.json();
          setPolls(data.polls || []);
        } else {
          console.error("Failed to fetch polls:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <Card className="animate-fade-in hover-lift transition-smooth gradient-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            No polls yet
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Create your first poll to start collecting responses
          </p>
          <Button
            asChild
            className="hover-glow transition-smooth gradient-primary"
          >
            <Link href="/polls/create">Create Your First Poll</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll, index) => (
        <Card
          key={poll.id}
          className="hover-lift transition-smooth animate-scale-in gradient-card"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2 text-foreground">
                  {poll.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  Created{" "}
                  {formatDistanceToNow(new Date(poll.created_at), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-colors-smooth"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/polls/${poll.id}`}
                      className="transition-colors-smooth"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/polls/${poll.id}/edit`}
                      className="transition-colors-smooth"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/polls/${poll.id}/results`}
                      className="transition-colors-smooth"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Results
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            {poll.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {poll.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={poll.is_public ? "default" : "secondary"}>
                  {poll.is_public ? "Public" : "Private"}
                </Badge>
                {poll.expires_at && (
                  <Badge variant="outline">
                    Expires{" "}
                    {formatDistanceToNow(new Date(poll.expires_at), {
                      addSuffix: true,
                    })}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {poll.vote_count || 0} votes
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
