"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Clock, Users } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  is_public: boolean;
  allow_multiple_votes: boolean;
  options: PollOption[];
}

interface PollDetailsProps {
  pollId: string;
  initialPoll?: Poll;
}

export function PollDetails({ pollId, initialPoll }: PollDetailsProps) {
  const [poll, setPoll] = useState<Poll | null>(initialPoll || null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialPoll);

  // Fetch poll data if not provided initially
  useEffect(() => {
    if (!initialPoll) {
      fetchPollData();
    }
  }, [pollId, initialPoll]);

  // Set up real-time updates
  useEffect(() => {
    if (!poll) return;

    const interval = setInterval(() => {
      fetchPollData(true); // Silent refresh
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [poll]);

  const fetchPollData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/polls/${pollId}`);
      if (response.ok) {
        const data = await response.json();
        setPoll(data.poll);
      } else {
        throw new Error("Failed to fetch poll data");
      }
    } catch (err) {
      setError("Failed to load poll data");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (hasVoted) return;

    if (poll?.allow_multiple_votes) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0 || !poll) return;

    setIsVoting(true);
    setError(null);

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIds: selectedOptions }),
      });

      if (response.ok) {
        setHasVoted(true);
        fetchPollData(true); // Refresh poll data to show updated results
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit vote");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || "Poll not found"}</AlertDescription>
      </Alert>
    );
  }

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );
  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();

  return (
    <div className="space-y-6">
      <Card className="hover-lift transition-smooth animate-scale-in">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground">
                {poll.title}
              </CardTitle>
              {poll.description && (
                <CardDescription className="mt-2 text-base">
                  {poll.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant={poll.is_public ? "default" : "secondary"}>
                {poll.is_public ? "Public" : "Private"}
              </Badge>
              {poll.allow_multiple_votes && (
                <Badge variant="outline">Multiple Votes</Badge>
              )}
              {isExpired && (
                <Badge variant="destructive">
                  <Clock className="mr-1 h-3 w-3" />
                  Expired
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Created{" "}
              {formatDistanceToNow(new Date(poll.created_at), {
                addSuffix: true,
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {totalVotes} total votes
            </span>
            {poll.expires_at && !isExpired && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Expires{" "}
                  {formatDistanceToNow(new Date(poll.expires_at), {
                    addSuffix: true,
                  })}
                </span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                {hasVoted || isExpired ? "Results" : "Cast Your Vote"}
              </h3>
              {hasVoted && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Voted
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {poll.options.map((option, index) => {
                const percentage =
                  totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                const isSelected = selectedOptions.includes(option.id);
                const canVote = !hasVoted && !isExpired;

                return (
                  <div
                    key={option.id}
                    className={`space-y-2 animate-scale-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                        ${canVote ? "hover-lift" : ""}
                        ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }
                        ${!canVote ? "cursor-default" : ""}
                      `}
                      onClick={() => canVote && handleOptionSelect(option.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">
                          {option.text}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {option.votes} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!hasVoted && !isExpired && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleVote}
                  disabled={selectedOptions.length === 0 || isVoting}
                  className="hover-glow transition-smooth"
                >
                  {isVoting ? "Submitting..." : "Submit Vote"}
                </Button>
                {selectedOptions.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedOptions([])}
                    className="hover-lift transition-smooth"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            )}

            {poll.allow_multiple_votes && !hasVoted && !isExpired && (
              <p className="text-sm text-muted-foreground">
                You can select multiple options for this poll.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
