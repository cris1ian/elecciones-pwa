import { Button } from "primereact/button";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./utils";

interface Props {
  isAuthenticated?: boolean;
}

export default function NotFound(props: Props) {
  const navigate = useNavigate();
  const doLogout = () => logout(navigate, true);

  return (
    <div className="flex flex-column justify-content-evenly align-items-center h-30rem">
      <i className="pi pi-spin pi-cog" style={{ fontSize: "2rem" }}></i>

      <h4>Esta página aún no ha sido creada</h4>

      {!props.isAuthenticated ? (
        <Link to="/"> Salir </Link>
      ) : (
        <Button onClick={doLogout} label="Salir " icon="pi pi-sign-out" rounded iconPos={"right"} />
      )}
    </div>
  );
}
