"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Users, Eye, TrendingUp } from "lucide-react";

export function DashboardStats() {
  // TODO: Fetch actual stats from API
  const stats = [
    {
      title: "Total Polls",
      value: "12",
      description: "+2 from last month",
      icon: BarChart3,
    },
    {
      title: "Total Votes",
      value: "1,234",
      description: "+180 from last month",
      icon: Users,
    },
    {
      title: "Poll Views",
      value: "5,678",
      description: "+12% from last month",
      icon: Eye,
    },
    {
      title: "Engagement Rate",
      value: "68%",
      description: "+5% from last month",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="gradient-card hover-lift transition-smooth"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
