export type Option = {
  id: string;
  text: string;
  poll_id: string;
};

export type Poll = {
  id: string;
  title: string;
  creator_id: string;
};

export type PollWithOptions = Poll & {
  options: Option[];
};
