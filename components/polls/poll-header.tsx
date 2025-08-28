'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PollHeaderProps {
  pollId: string
}

export function PollHeader({ pollId }: PollHeaderProps) {
  // TODO: Fetch poll data
  const poll = {
    id: pollId,
    title: "What's your favorite programming language?",
    description: "Help us understand the community preferences for our next project",
    creator: "John Doe",
    is_public: true,
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <Badge variant={poll.is_public ? 'default' : 'secondary'}>
            {poll.is_public ? 'Public Poll' : 'Private Poll'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Created by {poll.creator}
        </div>
      </CardHeader>
    </Card>
  )
}
