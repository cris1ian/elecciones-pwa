import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import * as Storage from "../../utils/storage";
import React from "react";
import { Login } from "screens/components/non-authenticated/Login";
import { Reports } from "screens/components/authenticated/reportes/Reportes";
import NotFound from "screens/common/NotFound";
import { TiposPuntosMuestrales } from "constants/tipos-puntos-muestrales";
import { CargaDeDatos } from "screens/components/authenticated/carga/CargaDeDatos";

export default function Router() {
  const resolveAuthentication = (): boolean => !!Storage.getObject("user");

  const resolveUserType = (): string =>
    Storage.getObject("tipo") === `${TiposPuntosMuestrales.TD}` ? `/home` : `/reportes`;

  const publicRoutes: RouteObject[] = [
    { path: "/", element: <Login /> },

    // Not found routes
    { path: "*", element: <NotFound /> },
  ];

  const authenticatedRoutes: RouteObject[] = [
    { path: "/home/:puntoMuestralId", element: <CargaDeDatos /> },
    { path: "/reportes", element: <Reports /> },
    { path: "/", element: <Navigate to={resolveUserType()} /> },

    // Not found routes
    { path: "*", element: <NotFound isAuthenticated /> },
  ];

  return useRoutes(resolveAuthentication() ? authenticatedRoutes : publicRoutes);
}
