'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'

interface VotingInterfaceProps {
  pollId: string
}

// TODO: Replace with actual poll data type
interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  allowMultipleVotes: boolean
  hasVoted: boolean
}

export function VotingInterface({ pollId }: VotingInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // TODO: Fetch poll data
  const poll: Poll = {
    id: pollId,
    title: "What's your favorite programming language?",
    description: "Help us understand the community preferences for our next project",
    options: [
      { id: '1', text: 'JavaScript', votes: 15 },
      { id: '2', text: 'Python', votes: 12 },
      { id: '3', text: 'TypeScript', votes: 8 },
      { id: '4', text: 'Go', votes: 5 },
    ],
    allowMultipleVotes: false,
    hasVoted: false,
  }

  const handleSubmitVote = async () => {
    if (!selectedOption) return

    setIsSubmitting(true)
    setError(null)

    try {
      // TODO: Implement vote submission
      console.log('Submitting vote:', { pollId, optionId: selectedOption })
      
      // Placeholder for actual API call
      // const response = await fetch(`/api/polls/${pollId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ optionId: selectedOption }),
      // })
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit vote')
      // }
      
      setHasVoted(true)
    } catch (err) {
      setError('Failed to submit vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasVoted || poll.hasVoted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Thank you for voting!</CardTitle>
          <CardDescription>
            Your vote has been recorded successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {poll.options.map((option) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span>{option.votes} votes ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          {poll.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <Button
          onClick={handleSubmitVote}
          disabled={!selectedOption || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      </CardContent>
    </Card>
  )
}
