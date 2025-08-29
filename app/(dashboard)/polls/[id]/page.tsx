import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PollDetails } from "@/components/polls/poll-details";
import { PollActions } from "@/components/polls/poll-actions";

interface PollPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PollPageProps): Promise<Metadata> {
  // TODO: Fetch poll data to generate dynamic metadata
  return {
    title: `Poll | ALX Polly`,
    description: "View poll details and results",
  };
}

export default async function PollPage({ params }: PollPageProps) {
  const pollId = params.id;

  // Fetch poll data on the server
  let poll = null;
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/polls/${pollId}`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );
    if (response.ok) {
      const data = await response.json();
      poll = data.poll;
    }
  } catch (error) {
    console.error("Failed to fetch poll:", error);
  }

  if (!poll) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-slide-down">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Poll Details
              </h1>
              <p className="text-muted-foreground">View and manage your poll</p>
            </div>
            <PollActions pollId={pollId} />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <PollDetails pollId={pollId} initialPoll={poll} />
          </div>
        </div>
      </div>
    </div>
  );
}
