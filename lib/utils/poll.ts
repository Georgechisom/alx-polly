import { Poll, PollOption } from "@/types";

// Enum for poll status
export const PollStatus = {
  ACTIVE: "active",
  EXPIRED: "expired",
} as const;

export type PollStatusType = (typeof PollStatus)[keyof typeof PollStatus];

/**
 * Calculates the total number of votes for a poll.
 * @param poll - The poll object.
 * @returns The total number of votes.
 */
export function getPollTotalVotes(poll: Poll): number {
  return (
    poll.options?.reduce((sum, option) => sum + (option.vote_count || 0), 0) ||
    0
  );
}

/**
 * Calculates the results of a poll, including vote counts and percentages.
 * @param poll - The poll object.
 * @returns An array of poll options with calculated results.
 */
export function calculatePollResults(poll: Poll) {
  if (!poll.options) return [];

  const totalVotes = getPollTotalVotes(poll);

  return poll.options.map((option) => {
    const votes = option.vote_count || 0;
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

    return {
      ...option,
      votes,
      percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
    };
  });
}

/**
 * Checks if a poll has expired.
 * @param poll - The poll object.
 * @returns True if the poll has expired, false otherwise.
 */
export function isPollExpired(poll: Poll): boolean {
  if (!poll.expires_at) return false;
  return new Date(poll.expires_at) < new Date();
}

/**
 * Checks if a poll is currently active.
 * @param poll - The poll object.
 * @returns True if the poll is active, false otherwise.
 */
export function isPollActive(poll: Poll): boolean {
  return !isPollExpired(poll);
}

/**
 * Gets the status of a poll ('active' or 'expired').
 * @param poll - The poll object.
 * @returns The poll status.
 */
export function getPollStatus(poll: Poll): PollStatusType {
  return isPollExpired(poll) ? PollStatus.EXPIRED : PollStatus.ACTIVE;
}

/**
 * Determines if a user can vote on a poll.
 * @param poll - The poll object.
 * @param userId - The ID of the user.
 * @returns True if the user can vote, false otherwise.
 */
export function canUserVote(poll: Poll, userId?: string): boolean {
  if (isPollExpired(poll)) return false;
  if (!poll.is_public && !userId) return false;
  // TODO: Check if the user has already voted if multiple votes are not allowed.
  return true;
}

/**
 * Formats the URL for a poll.
 * @param pollId - The ID of the poll.
 * @param type - The type of URL to generate ('vote', 'view', or 'results').
 * @returns The formatted poll URL.
 */
export function formatPollUrl(
  pollId: string,
  type: "vote" | "view" | "results" = "vote"
): string {
  export function formatPollUrl(
    pollId: string,
    type: "vote" | "view" | "results" = "vote"
  ): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const path =
      {
        vote: `/vote/${pollId}`,
        view: `/polls/${pollId}`,
        results: `/polls/${pollId}/results`,
      }[type] || `/vote/${pollId}`; // fallback to vote URL
    return `${baseUrl}${path}`;
  }
}

/**
 * Generates a shareable text for a poll.
 * @param poll - The poll object.
 * @returns The shareable text.
 */
export function generatePollShareText(poll: Poll): string {
  return `Vote on: ${poll.title} - ${formatPollUrl(poll.id, "vote")}`;
}

/**
 * Validates and cleans poll options.
 * @param options - An array of poll option strings.
 * @returns A unique, trimmed, and filtered array of poll options.
 */
export function validatePollOptions(options: string[]): string[] {
  const cleanedOptions = options.map((option) => option.trim()).filter(Boolean);
  const uniqueOptions = Array.from(
    new Set(cleanedOptions.map((opt) => opt.toLowerCase()))
  ).map(
    (lowerCaseOpt) =>
      cleanedOptions.find((opt) => opt.toLowerCase() === lowerCaseOpt)!
  );
  return uniqueOptions;
}

/**
 * Sorts poll options by their order index.
 * @param options - An array of poll options.
 * @returns A sorted array of poll options.
 */
export function sortPollOptions(options: PollOption[]): PollOption[] {
  return [...options].sort((a, b) => a.order_index - b.order_index);
}

/**
 * Gathers analytics for a poll.
 * @param poll - The poll object.
 * @returns An object containing poll analytics.
 */
export function getPollAnalytics(poll: Poll) {
  const options = poll.options || [];
  const totalVotes = getPollTotalVotes(poll);

  const mostPopular =
    options.length > 0
      ? options.reduce((prev, current) =>
          (current.vote_count || 0) > (prev.vote_count || 0) ? current : prev
        )
      : null;

  const averageVotesPerOption =
    options.length > 0 ? totalVotes / options.length : 0;

  return {
    totalVotes,
    totalOptions: options.length,
    mostPopular: mostPopular
      ? {
          text: mostPopular.text,
          votes: mostPopular.vote_count || 0,
          percentage:
            totalVotes > 0
              ? ((mostPopular.vote_count || 0) / totalVotes) * 100
              : 0,
        }
      : null,
    averageVotesPerOption: Math.round(averageVotesPerOption * 100) / 100,
  };
}

/**
 * Gets the time remaining until a poll expires.
 * @param poll - The poll object.
 * @returns A human-readable string of the time remaining or 'Expired'.
 */
export function getTimeUntilExpiry(poll: Poll): string | null {
  if (!poll.expires_at) return null;

  const diff = new Date(poll.expires_at).getTime() - new Date().getTime();
  if (diff <= 0) return "Expired";

  const units = [
    { value: 24 * 60 * 60 * 1000, label: "day" },
    { value: 60 * 60 * 1000, label: "hour" },
    { value: 60 * 1000, label: "minute" },
  ];

  for (const unit of units) {
    const value = Math.floor(diff / unit.value);
    if (value > 0) return `${value} ${unit.label}${value > 1 ? "s" : ""}`;
  }

  return "Less than a minute";
}
