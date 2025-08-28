import { Metadata } from 'next'
import { CreatePollForm } from '@/components/polls/create-poll-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Create Poll | ALX Polly',
  description: 'Create a new poll',
}

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Poll</h1>
          <p className="text-muted-foreground">
            Create a new poll and start collecting responses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poll Details</CardTitle>
            <CardDescription>
              Fill in the details for your new poll
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePollForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
