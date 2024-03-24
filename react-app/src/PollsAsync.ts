const pollsUrl = "http://localhost:8000/polls/";

export async function fetchPolls(token: string | null) {
  try {
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `bearer ${token}`;
    }

    const response = await fetch(pollsUrl, { headers });

    const people = await response.json();

    return people;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchPoll(
  index: string | number,
  token: string | null
) {
  try {
    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization = `bearer ${token}`;
    }

    const response = await fetch(`${pollsUrl}/${index}`, { headers });

    const poll = await response.json();

    return poll;
  } catch (error) {
    console.error(error);
    return null;
  }
}
