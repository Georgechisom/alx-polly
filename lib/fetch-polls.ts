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

export async function getPolls(
  skip: number = 0,
  limit: number = 10
): Promise<Poll[]> {
  const response = await fetch(`/api/polls?skip=${skip}&limit=${limit}`, {
    headers: {
      "Cache-Control": "max-age=60, stale-while-revalidate=300",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch polls: ${response.statusText}`);
  }

  const data = await response.json();
  return data.polls || [];
}
