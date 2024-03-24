const pollsUrl = "http://localhost:8000/polls/";

export interface Poll {
  pub_date: Date;
  question_text: string;
  id: number;
}

export interface PollContract {
  fields: {
    pub_date: string;
    question_text: string;
  },
  pk: number;
}

function mapPollContractToPoll(contract: PollContract): Poll {
  return {
      id: contract.pk,
      pub_date: new Date(contract.fields.pub_date),
      question_text: contract.fields.question_text
  }
}

export async function fetchPolls(token: string | null): Promise<Poll[]> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/json'
    };

    if (token) {
      headers.Authorization = `bearer ${token}`;
    }

    const response = await fetch(pollsUrl, { headers });

    const polls = (await response.json()) as PollContract[];
    return polls.map(mapPollContractToPoll);

  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchPoll(
  index: string | number,
  token: string | null
): Promise<Poll | null> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/json'
    };

    if (token) {
      headers.Authorization = `bearer ${token}`;
    }

    const response = await fetch(`${pollsUrl}${index}`, { headers });

    const poll = await (response.json()) as Poll;

    return poll;
  } catch (error) {
    console.error(error);
    return null;
  }
}
