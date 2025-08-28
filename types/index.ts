// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  username?: string
  avatar_url?: string
  created_at: string
}

export interface Poll {
  id: string
  title: string
  description?: string
  creator_id: string
  is_public: boolean
  allow_multiple_votes: boolean
  expires_at?: string
  created_at: string
  updated_at: string
  creator?: User
  options?: PollOption[]
  analytics?: PollAnalytics
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  order_index: number
  created_at: string
  votes?: Vote[]
  vote_count?: number
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  user_id?: string
  voter_ip?: string
  created_at: string
  user?: User
  option?: PollOption
}

export interface PollAnalytics {
  id: string
  poll_id: string
  total_votes: number
  unique_voters: number
  last_vote_at?: string
  updated_at: string
}

// Form types
export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  allowMultipleVotes: boolean
  expiresAt?: string
  isPublic: boolean
}

export interface UpdatePollData {
  title?: string
  description?: string
  expires_at?: string
  is_public?: boolean
}

export interface VoteData {
  optionId: string
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

// Component prop types
export interface PollCardProps {
  poll: Poll
  showActions?: boolean
}

export interface VotingInterfaceProps {
  poll: Poll
  onVote?: (optionId: string) => void
}

export interface PollResultsProps {
  poll: Poll
  showAnalytics?: boolean
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    username?: string
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  user: AuthUser
}

// Error types
export interface ApiError {
  message: string
  status: number
  code?: string
}

export interface ValidationError {
  field: string
  message: string
}

// Utility types
export type PollStatus = 'active' | 'expired' | 'draft'
export type VoteType = 'single' | 'multiple'
export type PollVisibility = 'public' | 'private'
