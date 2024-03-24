import { useState } from "react";
import { AuthState } from "./Auth/AuthProvider";
import { useAuth } from "./Auth/useAuth";
import { fetchPolls, fetchPoll } from "./PollsAsync";
import { Person } from "./Person";
import "./Home.css";

export function Home() {
  const [polls, setPolls] = useState([]);
  const [poll, setPoll] = useState(null);

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
          console.log('polls!!!', polls);
          setPolls(polls);
        }}
      >
        Fetch polls
      </button>
      polls:
      {/* {polls.map((person, index) => (
        <Person key={index} {...person} />
      ))} */}
      <button
        onClick={async () => {
          // const poll = await fetchPoll(
          //   0,
          //   auth.user ? auth.user.id_token : null
          // );
          // setPoll(poll);
        }}
      >
        Fetch poll
      </button>
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
