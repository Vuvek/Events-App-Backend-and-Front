import React from "react";
import Login from "../components/Login";
import AppLayout from "./AppLayout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import SignUp from "../components/Signup";
import PageNotFound from "../components/InvalidRoutes/PageNotFound";

const Routes = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
            path:"/",
            element : <Home />
        },
        {
          path: "/signin",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
      ],
    },
    {
      path : "*",
      element : <PageNotFound />
    }
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Routes;
