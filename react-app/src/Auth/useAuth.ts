import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export function useAuth() {
  const auth = useContext(AuthContext);

  return auth;
}
