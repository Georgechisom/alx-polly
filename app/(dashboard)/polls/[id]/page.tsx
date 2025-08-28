import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PollDetails } from '@/components/polls/poll-details'
import { PollActions } from '@/components/polls/poll-actions'

interface PollPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PollPageProps): Promise<Metadata> {
  // TODO: Fetch poll data to generate dynamic metadata
  return {
    title: `Poll | ALX Polly`,
    description: 'View poll details and results',
  }
}

export default async function PollPage({ params }: PollPageProps) {
  // TODO: Fetch poll data
  const pollId = params.id

  // TODO: Add actual poll fetching logic
  // const poll = await getPoll(pollId)
  // if (!poll) {
  //   notFound()
  // }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Poll Details</h1>
            <p className="text-muted-foreground">
              View and manage your poll
            </p>
          </div>
          <PollActions pollId={pollId} />
        </div>

        <PollDetails pollId={pollId} />
      </div>
    </div>
  )
}
