"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Vote, Plus, BarChart3, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const supabase = createClient();

  const isLoggedIn = !!user;
  const userName = user?.user_metadata?.full_name || user?.email || "User";

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const loggedOutItems = [{ href: "/", label: "Home", icon: Vote }];

  const loggedInItems = [
    { href: "/dashboard", label: "My Polls", icon: BarChart3 },
    { href: "/polls/create", label: "Create Poll", icon: Plus },
  ];

  const navItems = isLoggedIn ? loggedInItems : loggedOutItems;

  if (loading) {
    return (
      <nav className="bg-background/95 border-b backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">ALX Polly</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <ThemeToggle />
              <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="md:hidden">
              <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background/95 border-b backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-glow">
            <Vote className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">ALX Polly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors-smooth"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons or User Info */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Button
                  variant="ghost"
                  className="transition-colors-smooth hover-lift"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  className="hover-glow transition-smooth gradient-primary"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary/50 transition-colors-smooth"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Theme Toggle and Auth */}
            <div className="px-4 py-3 space-y-3 border-t border-border mt-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>

              {isLoggedIn ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{userName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start transition-colors-smooth hover-lift"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    asChild
                    className="justify-start hover-glow transition-smooth gradient-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
