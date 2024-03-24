import { ReactElement, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth/useAuth";

export function SigninCallbackHandler(): ReactElement {
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      return;
    }

    auth.signinRedirectCallback();
  }, []);

  return auth.user ? <Navigate to="/" replace /> : <>Loading</>;
}
