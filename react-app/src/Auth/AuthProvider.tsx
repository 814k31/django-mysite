import { User, UserManager, UserManagerSettings } from "oidc-client-ts";
import { ReactElement, createContext, useMemo, useState } from "react";

export enum AuthState {
  Signingin,
  Signingout,
  Idle,
}

export interface AuthContextValue {
  state: AuthState;
  loggedIn: boolean;
  userManager: UserManager | null;
  login(): Promise<void>;
  signinRedirectCallback(): Promise<void>;
  user: User | null;
  logout(): void;
  signoutRedirectCallback(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  state: AuthState.Idle,
  loggedIn: false,
  userManager: null,
  login: () => Promise.reject("Should not have been triggered"),
  signinRedirectCallback: () =>
    Promise.reject("Should not have been triggered"),
  user: null,
  logout: () => {
    throw new Error("Should not have been triggered");
  },
  signoutRedirectCallback: () =>
    Promise.reject("Should not have been triggered"),
});

interface AuthProviderProps {
  children: ReactElement;
  config: UserManagerSettings;
}

export const AuthProvider = ({ children, config }: AuthProviderProps) => {
  const userManager = useMemo(() => new UserManager(config), []);
  const [authState, setAuthState] = useState<AuthState>(AuthState.Idle);
  const [user, setUser] = useState<User | null>(null);

  async function login() {
    console.log(user, authState)
    if (user || authState !== AuthState.Idle) {
      return;
    }

    setAuthState(AuthState.Signingin);

    try {
      // Fetch user
      console.log('yay');
      const loadedUser = await userManager.getUser();
      console.log('loadedUser', loadedUser);
      if (loadedUser) {
        setUser(loadedUser);
        setAuthState(AuthState.Idle);
        return;
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }

    try {
      // Silently login and fetch user
      const silentUser = await userManager.signinSilent();
      if (silentUser) {
        setUser(silentUser);
        setAuthState(AuthState.Idle);
        return;
      }
    } catch (error) {
      console.error("Error silently logging in and fetching user", error);
    }

    await userManager.signinRedirect();
  }

  async function signinRedirectCallback() {
    try {
      const newUser = await userManager.signinRedirectCallback();
      setUser(newUser);
      setAuthState(AuthState.Idle);
    } catch (error) {
      console.error("signinRedirectCallback", error);
    }

    setAuthState(AuthState.Idle);
  }

  function logout() {
    setAuthState(AuthState.Signingin);
    userManager.signoutRedirect();
    setUser(null);
  }

  async function signoutRedirectCallback() {
    await userManager.signoutRedirectCallback();
    setUser(null);
    setAuthState(AuthState.Idle);
  }

  return (
    <AuthContext.Provider
      value={{
        state: authState,
        userManager,
        loggedIn: !!user,
        login,
        signinRedirectCallback,
        user,
        logout,
        signoutRedirectCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
