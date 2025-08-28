import { Metadata } from 'next'
import { PollsList } from '@/components/polls/polls-list'
import { CreatePollButton } from '@/components/polls/create-poll-button'
import { DashboardStats } from '@/components/shared/dashboard-stats'
import { UserProfile } from '@/components/auth/user-profile'

export const metadata: Metadata = {
  title: 'Dashboard | ALX Polly',
  description: 'Manage your polls and view analytics',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
        <DashboardStats />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Polls</h2>
          <PollsList />
        </div>
      </div>
    </div>
  )
}
