import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Register | ALX Polly",
  description: "Create your ALX Polly account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="hover-lift transition-smooth">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-foreground animate-slide-down">
              Create an account
            </CardTitle>
            <CardDescription
              className="animate-slide-down"
              style={{ animationDelay: "0.2s" }}
            >
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent
            className="animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <RegisterForm />
            <div className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary transition-colors-smooth"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
