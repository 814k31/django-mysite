import { ReactElement, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth/useAuth";

export function SignoutCallbackHandler(): ReactElement {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user) {
      return;
    }

    auth.signoutRedirectCallback();
  }, []);

  return !auth.user ? <Navigate to="/" replace /> : <>Loading</>;
}
