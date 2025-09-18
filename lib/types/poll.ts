export interface PollOption {
  id: string;
  pollId: string;
  text: string;
  position?: number;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface PollWithOptions extends Poll {
  options: PollOption[];
}
