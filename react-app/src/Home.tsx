import { useState } from "react";
import { AuthState } from "./Auth/AuthProvider";
import { useAuth } from "./Auth/useAuth";
import { fetchPolls, Poll } from "./PollsAsync";
import { Poll as PollComponent } from "./Poll";
import "./Home.css";

export function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);

  const auth = useAuth();

  return (
    <>
      {auth.state !== AuthState.Idle && <h1 className="loading">LOADING</h1>}
      <button
        disabled={!!auth.user || auth.state !== AuthState.Idle}
        onClick={auth.login}
      >
        login
      </button>
      <button
        onClick={async () => {
          const polls = await fetchPolls(auth.user?.id_token || null);
          setPolls(polls);
        }}
      >
        Fetch polls
      </button>
      polls:
      {polls.map((poll) => (
        <PollComponent key={poll.id} poll={poll} />
      ))}
      Poll:
      {/* {poll && <Person {...poll} />} */}
      <button
        disabled={!auth.user || auth.state !== AuthState.Idle}
        onClick={auth.logout}
      >
        logout
      </button>
    </>
  );
}
