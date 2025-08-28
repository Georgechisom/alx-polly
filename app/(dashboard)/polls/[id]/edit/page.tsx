import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditPollForm } from '@/components/polls/edit-poll-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EditPollPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditPollPageProps): Promise<Metadata> {
  return {
    title: `Edit Poll | ALX Polly`,
    description: 'Edit your poll details',
  }
}

export default async function EditPollPage({ params }: EditPollPageProps) {
  const pollId = params.id

  // TODO: Fetch poll data and check ownership
  // const poll = await getPoll(pollId)
  // if (!poll) {
  //   notFound()
  // }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Poll</h1>
          <p className="text-muted-foreground">
            Update your poll details and options
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poll Details</CardTitle>
            <CardDescription>
              Update the details for your poll
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditPollForm pollId={pollId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
