import {
  BrowserRouter,
  RouteObject,
  RouterProvider,
  Routes,
  createBrowserRouter,
  useLocation,
  useRoutes,
} from "react-router-dom";
import { useEffect, useState } from "react";
import * as Storage from "../../utils/storage";
import React from "react";
import { Login } from "screens/non-authenticated/Login";
import { Home } from "screens/authenticated/Home";
import { Reports } from "screens/authenticated/Reportes";
import NotFound from "screens/common/NotFound";

export default function Router() {
  let location = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const _user: any = Storage.getObject("user");
    setAuthenticated(Boolean(_user));
  }, []);

  useEffect(() => {
    const _user: any = Storage.getObject("user");
    setAuthenticated(Boolean(_user));
    console.log("location changed", location);
  }, [location]);

  const publicRoutes: RouteObject[] = [
    { path: "/", element: <Login /> },
    // Not found routes work as you'd expect
    { path: "*", element: <NotFound /> },
  ];

  const authenticatedRoutes: RouteObject[] = [
    { path: "/home", element: <Home /> },
    { path: "/reportes", element: <Reports /> },

    // Not found routes work as you'd expect
    { path: "*", element: <NotFound /> },
  ];

  return useRoutes(authenticated ? authenticatedRoutes : publicRoutes);
}
