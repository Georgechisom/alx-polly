import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Users, Zap, QrCode } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 animate-slide-down">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary transition-colors-smooth" />
            <span className="text-2xl font-bold text-foreground">
              ALX Polly
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              asChild
              className="transition-colors-smooth hover-lift"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="hover-glow transition-smooth gradient-primary"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-6 animate-slide-up">
            Create Polls That Matter
          </h1>
          <p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Build engaging polls, collect real-time responses, and share
            insights with your audience. Perfect for teams, educators, and
            community builders.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              asChild
              className="hover-glow transition-smooth gradient-primary"
            >
              <Link href="/register">Start Creating</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="hover-lift transition-smooth"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card
            className="hover-lift transition-smooth animate-scale-in gradient-card"
            style={{ animationDelay: "0.6s" }}
          >
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4 transition-colors-smooth" />
              <CardTitle className="text-foreground">
                Real-time Results
              </CardTitle>
              <CardDescription>
                Watch votes come in live with instant updates and beautiful
                visualizations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover-lift transition-smooth animate-scale-in gradient-card"
            style={{ animationDelay: "0.8s" }}
          >
            <CardHeader>
              <QrCode className="h-12 w-12 text-primary mb-4 transition-colors-smooth" />
              <CardTitle className="text-foreground">Easy Sharing</CardTitle>
              <CardDescription>
                Share polls via QR codes, links, or embed them directly in your
                content
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover-lift transition-smooth animate-scale-in gradient-card"
            style={{ animationDelay: "1.0s" }}
          >
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4 transition-colors-smooth" />
              <CardTitle className="text-foreground">
                Audience Insights
              </CardTitle>
              <CardDescription>
                Get detailed analytics and understand your audience better
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: "1.2s" }}
        >
          <Card className="max-w-2xl mx-auto hover-lift transition-smooth gradient-card">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Ready to get started?
              </CardTitle>
              <CardDescription>
                Join thousands of users creating engaging polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                asChild
                className="hover-glow transition-smooth gradient-primary"
              >
                <Link href="/register">Create Your First Poll</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
