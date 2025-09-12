/**
 * Cast a vote on an existing poll.
 * @param pollId - The ID of the poll to vote on.
 * @param optionId - The ID of the selected option.
 * @returns A message indicating success or throws an error.
 */
export async function voteOnPoll(
  pollId: string,
  optionId: string
): Promise<string> {
  try {
    const response = await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ optionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to cast vote");
    }

    const data = await response.json();
    return data.message || "Vote recorded successfully";
  } catch (error: any) {
    throw new Error(error.message || "An unknown error occurred while voting");
  }
}

/**
 * Retrieve the results of a poll.
 * @param pollId - The ID of the poll to get results for.
 * @returns The poll data including options and vote counts.
 */
export interface Poll {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  is_public: boolean;
  allow_multiple_votes: boolean;
  creator_id: string;
  poll_options: {
    id: string;
    text: string;
    order_index: number;
    poll_id: string;
    votes: number;
    created_at: string;
    updated_at: string;
  }[];
}

export async function getPollResults(pollId: string): Promise<Poll> {
  try {
    const response = await fetch(`/api/polls/${pollId}/results`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch poll results");
    }

    const data = await response.json();
    return data.poll;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "An unknown error occurred while fetching poll results"
      );
    }
    throw new Error("An unknown error occurred while fetching poll results");
  }
}
