import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import { SigninCallbackHandler } from './SigninCallbackHandler';
import { SignoutCallbackHandler } from './SignoutCallbackHandler';
import { AuthProvider } from './Auth/AuthProvider';
import config from "./config.json";
import { Home } from './Home';

function App() {
  const router = createBrowserRouter([
    {
      path: "/callback",
      element: <SigninCallbackHandler />,
    },
    {
      path: "/logout",
      element: <SignoutCallbackHandler />,
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
