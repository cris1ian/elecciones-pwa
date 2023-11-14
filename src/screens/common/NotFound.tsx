import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-column justify-content-evenly align-items-center h-30rem">
      <i className="pi pi-spin pi-cog" style={{ fontSize: "2rem" }}></i>
      <h4>Esta página aún no ha sido creada</h4>
      <Link to="/"> Volver </Link>
    </div>
  );
}
