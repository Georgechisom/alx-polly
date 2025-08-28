'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface PollDetailsProps {
  pollId: string
}

export function PollDetails({ pollId }: PollDetailsProps) {
  // TODO: Fetch poll data
  const poll = {
    id: pollId,
    title: "What's your favorite programming language?",
    description: "Help us understand the community preferences for our next project",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    expires_at: null,
    is_public: true,
    allow_multiple_votes: false,
    options: [
      { id: '1', text: 'JavaScript', votes: 15 },
      { id: '2', text: 'Python', votes: 12 },
      { id: '3', text: 'TypeScript', votes: 8 },
      { id: '4', text: 'Go', votes: 5 },
    ],
  }

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{poll.title}</CardTitle>
              {poll.description && (
                <CardDescription className="mt-2 text-base">
                  {poll.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant={poll.is_public ? 'default' : 'secondary'}>
                {poll.is_public ? 'Public' : 'Private'}
              </Badge>
              {poll.allow_multiple_votes && (
                <Badge variant="outline">Multiple Votes</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}</span>
            <span>•</span>
            <span>{totalVotes} total votes</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Poll Options</h3>
            <div className="space-y-3">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-muted-foreground">
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
