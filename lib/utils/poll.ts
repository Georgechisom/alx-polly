import { Poll, PollOption, Vote } from '@/types'

export function calculatePollResults(poll: Poll) {
  if (!poll.options) return []

  const totalVotes = poll.options.reduce((sum, option) => sum + (option.vote_count || 0), 0)

  return poll.options.map((option) => {
    const votes = option.vote_count || 0
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

    return {
      ...option,
      votes,
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
    }
  })
}

export function isPollExpired(poll: Poll): boolean {
  if (!poll.expires_at) return false
  return new Date(poll.expires_at) < new Date()
}

export function isPollActive(poll: Poll): boolean {
  return !isPollExpired(poll)
}

export function getPollStatus(poll: Poll): 'active' | 'expired' {
  return isPollExpired(poll) ? 'expired' : 'active'
}

export function canUserVote(poll: Poll, userId?: string): boolean {
  // Check if poll is expired
  if (isPollExpired(poll)) return false

  // Check if poll is public or user has access
  if (!poll.is_public && !userId) return false

  // TODO: Check if user has already voted (if multiple votes not allowed)
  // This would require checking the votes data
  
  return true
}

export function formatPollUrl(pollId: string, type: 'vote' | 'view' | 'results' = 'vote'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  switch (type) {
    case 'vote':
      return `${baseUrl}/vote/${pollId}`
    case 'view':
      return `${baseUrl}/polls/${pollId}`
    case 'results':
      return `${baseUrl}/polls/${pollId}/results`
    default:
      return `${baseUrl}/vote/${pollId}`
  }
}

export function generatePollShareText(poll: Poll): string {
  return `Vote on: ${poll.title} - ${formatPollUrl(poll.id, 'vote')}`
}

export function validatePollOptions(options: string[]): string[] {
  // Remove empty options and trim whitespace
  const cleanOptions = options
    .map(option => option.trim())
    .filter(option => option.length > 0)

  // Remove duplicates (case-insensitive)
  const uniqueOptions = cleanOptions.filter((option, index, arr) => 
    arr.findIndex(o => o.toLowerCase() === option.toLowerCase()) === index
  )

  return uniqueOptions
}

export function sortPollOptions(options: PollOption[]): PollOption[] {
  return [...options].sort((a, b) => a.order_index - b.order_index)
}

export function getPollAnalytics(poll: Poll) {
  const options = poll.options || []
  const totalVotes = options.reduce((sum, option) => sum + (option.vote_count || 0), 0)
  
  // Find most popular option
  const mostPopular = options.reduce((prev, current) => 
    (current.vote_count || 0) > (prev.vote_count || 0) ? current : prev
  , options[0])

  // Calculate engagement metrics
  const averageVotesPerOption = totalVotes / options.length
  const engagementRate = totalVotes > 0 ? (totalVotes / (totalVotes + 100)) * 100 : 0 // Placeholder calculation

  return {
    totalVotes,
    totalOptions: options.length,
    mostPopular: mostPopular ? {
      text: mostPopular.text,
      votes: mostPopular.vote_count || 0,
      percentage: totalVotes > 0 ? ((mostPopular.vote_count || 0) / totalVotes) * 100 : 0
    } : null,
    averageVotesPerOption: Math.round(averageVotesPerOption * 100) / 100,
    engagementRate: Math.round(engagementRate * 100) / 100,
  }
}

export function getTimeUntilExpiry(poll: Poll): string | null {
  if (!poll.expires_at) return null

  const now = new Date()
  const expiry = new Date(poll.expires_at)
  const diff = expiry.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${minutes} minute${minutes > 1 ? 's' : ''}`
}
