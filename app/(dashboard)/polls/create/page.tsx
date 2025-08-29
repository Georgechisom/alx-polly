import { Metadata } from "next";
import { CreatePollForm } from "@/components/polls/create-poll-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Poll | ALX Polly",
  description: "Create a new poll",
};

export default function CreatePollPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create New Poll
          </h1>
          <p className="text-muted-foreground">
            Create a new poll and start collecting responses
          </p>
        </div>

        <Card
          className="hover-lift transition-smooth animate-scale-in gradient-card"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader>
            <CardTitle className="text-foreground">Poll Details</CardTitle>
            <CardDescription>
              Fill in the details for your new poll
            </CardDescription>
          </CardHeader>
          <CardContent
            className="animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <CreatePollForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
