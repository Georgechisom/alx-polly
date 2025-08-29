import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login | ALX Polly",
  description: "Sign in to your ALX Polly account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="hover-lift transition-smooth bg-background/80 backdrop-blur-sm border-border/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-foreground animate-slide-down">
              Welcome back
            </CardTitle>
            <CardDescription
              className="animate-slide-down"
              style={{ animationDelay: "0.2s" }}
            >
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent
            className="animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <LoginForm />
            <div className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-primary transition-colors-smooth"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
