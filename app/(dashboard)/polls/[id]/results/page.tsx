import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PollResults } from '@/components/polls/poll-results'
import { PollResultsHeader } from '@/components/polls/poll-results-header'

interface PollResultsPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PollResultsPageProps): Promise<Metadata> {
  return {
    title: `Poll Results | ALX Polly`,
    description: 'View poll results and analytics',
  }
}

export default async function PollResultsPage({ params }: PollResultsPageProps) {
  const pollId = params.id

  // TODO: Fetch poll data
  // const poll = await getPoll(pollId)
  // if (!poll) {
  //   notFound()
  // }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <PollResultsHeader pollId={pollId} />
        <PollResults pollId={pollId} />
      </div>
    </div>
  )
}
