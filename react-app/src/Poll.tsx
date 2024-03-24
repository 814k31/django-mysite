import { Poll as PollModel } from './PollsAsync';

interface PollProps {
  poll: PollModel
}

export function Poll({ poll }: PollProps) {
  return (
    <div>
        Fetch poll
      <div>Date Published: {poll.pub_date.toLocaleDateString()}</div>
      <div>Question: {poll.question_text}</div>
    </div>
  );
}
