import React from "react";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainAppLayout from "./Layouts/MainAppLayout";
import Dashboardd from "./Pages/Dashboardd";
import Login from "./Pages/Login";
import NewAccount from "./Pages/NewAccount";
import NextAI from "./Pages/NextAI";
import { UserContext } from "./Contexts/UserContext";
import NSFW from "./Pages/NSFW";

function ProtectedRoute({ children }) {
  const { user, loading } = React.useContext(UserContext);
  // console.log(user, loading);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function RestrictedForLoggedInUsers({ children }) {
  const { user, loading } = React.useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/" /> : children;
}

function OnBoardCheck({ children }) {
  const { user, loading } = React.useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  return user.OnBoardCheck ? children : <Navigate to="/onboarding" />;
}

function App() {
  const routes = [
    {
      path: "/",
      element: (
        // <ProtectedRoute>
        // <OnBoardCheck>
        <MainAppLayout />
        // </OnBoardCheck>
        // </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            // <ProtectedRoute>
            <Dashboardd />
            // </ProtectedRoute>
          ),
        },
        {
          path: "nextai",
          element: <NextAI />,
        },
        {
          path: "nsfw",
          element: <NSFW />,
        },
        {
          path: "pricing",
          element: <>pricing</>,
        },
        {
          path: "/u/:uid",
          element: <>Hello</>,
        },
      ],
    },
    {
      path: "/login",
      element: (
        // <RestrictedForLoggedInUsers>
        <Login />
        // </RestrictedForLoggedInUsers>
      ),
    },
    {
      path: "/newAccount",
      element: <NewAccount />,
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <NextUIProvider className="w-full h-full flex items-center justify-center">
      <RouterProvider router={router} />
    </NextUIProvider>
  );
}

export default App;
