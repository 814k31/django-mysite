import './App.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SigninCallbackHandler } from './SigninCallbackHandler';
import { SignoutCallbackHandler } from './SignoutCallbackHandler';
import { AuthProvider } from './Auth/AuthProvider';
import config from "./config.json";
import { Home } from './Home';

function App() {
  const router = createBrowserRouter([
    {
      path: "/callback",
      element: <SigninCallbackHandler key={1} />,
    },
    {
      path: "/logout",
      element: <SignoutCallbackHandler key={1} />,
    },
    {
      path: "/",
      element: <Home />
    }
  ]);

  return (
    <AuthProvider config={config}>
        <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
