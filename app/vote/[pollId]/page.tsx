import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { VotingInterface } from '@/components/polls/voting-interface'
import { PollHeader } from '@/components/polls/poll-header'

interface VotePageProps {
  params: {
    pollId: string
  }
}

export async function generateMetadata({ params }: VotePageProps): Promise<Metadata> {
  // TODO: Fetch poll data to generate dynamic metadata
  return {
    title: `Vote | ALX Polly`,
    description: 'Cast your vote on this poll',
  }
}

export default async function VotePage({ params }: VotePageProps) {
  const pollId = params.pollId

  // TODO: Fetch poll data
  // const poll = await getPoll(pollId)
  // if (!poll || !poll.is_public) {
  //   notFound()
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <PollHeader pollId={pollId} />
          <VotingInterface pollId={pollId} />
        </div>
      </div>
    </div>
  )
}
