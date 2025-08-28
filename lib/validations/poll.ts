import { z } from 'zod'

export const createPollSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  options: z
    .array(z.string().min(1, 'Option cannot be empty'))
    .min(2, 'At least 2 options are required')
    .max(10, 'Maximum 10 options allowed'),
  allowMultipleVotes: z.boolean().default(false),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'Expiry date must be in the future'
    ),
  isPublic: z.boolean().default(true),
})

export const updatePollSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  expiresAt: z
    .string()
    .datetime()
    .optional()
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'Expiry date must be in the future'
    ),
  isPublic: z.boolean().optional(),
})

export const voteSchema = z.object({
  optionId: z.string().uuid('Invalid option ID'),
})

export const pollQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['active', 'expired', 'all']).default('all'),
  sortBy: z.enum(['created_at', 'title', 'vote_count']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreatePollInput = z.infer<typeof createPollSchema>
export type UpdatePollInput = z.infer<typeof updatePollSchema>
export type VoteInput = z.infer<typeof voteSchema>
export type PollQueryInput = z.infer<typeof pollQuerySchema>
