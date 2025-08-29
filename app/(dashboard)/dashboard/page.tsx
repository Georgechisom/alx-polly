import { Metadata } from "next";
import { PollsList } from "@/components/polls/polls-list";
import { CreatePollButton } from "@/components/polls/create-poll-button";
import { DashboardStats } from "@/components/shared/dashboard-stats";
import { UserProfile } from "@/components/auth/user-profile";

export const metadata: Metadata = {
  title: "Dashboard | ALX Polly",
  description: "Manage your polls and view analytics",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your polls and view analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <CreatePollButton />
            <UserProfile />
          </div>
        </div>

        <div className="space-y-8">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <DashboardStats />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Your Polls
            </h2>
            <PollsList />
          </div>
        </div>
      </div>
    </div>
  );
}
