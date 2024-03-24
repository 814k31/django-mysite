import { ReactElement, useEffect } from "react";
import { redirect } from "react-router-dom";
import { useAuth } from "./Auth/useAuth";

export function SignoutCallbackHandler(): ReactElement {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user) {
      redirect("/");
      return;
    }

    auth.signoutRedirectCallback();
  }, [auth.user]);

  return <>Loading</>;
}
