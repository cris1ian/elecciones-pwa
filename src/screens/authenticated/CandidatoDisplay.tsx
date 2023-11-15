import { Resultado } from "models/resultado.model";
import { Avatar } from "primereact/avatar";
import { ProgressBar } from "primereact/progressbar";
import React from "react";
import styles from "./Reportes.module.scss";
import { formatNumber, splitName } from "screens/common/utils";

interface Props {
  candidato: Resultado;
}

export function CandidatoDisplay(props: Props) {

  return (
    <div className="pb-3">
      <div className="flex align-items-center py-1">
        <div>
          <Avatar
            icon="pi pi-user"
            image={props.candidato.urlImagen}
            style={{ backgroundColor: "#cfcfcf", borderRadius: "50%", color: "gray" }}
            size="xlarge"
            shape="circle"
          />
        </div>

        <div className="flex flex-column w-full">
          <div className="px-3 flex flex-grow justify-content-center align-items-center">
            <div className={styles.nombre}>{splitName(props.candidato.candidatoNombre)}</div>
            <div className={styles.porcentaje}>{props.candidato.porcentaje}%</div>
          </div>
          <div className={styles.votos}>
            <span className={styles.title}>Votos:</span>
            <span className={styles.value}>{formatNumber(props.candidato.contados)}</span>
            <span className={styles.title}>Proy:</span>
            <span className={styles.value}>{formatNumber(props.candidato.proyectados)}</span>
          </div>
        </div>
      </div>
      <ProgressBar
        showValue={false}
        color={"#2089dc"}
        style={{ height: "4px" }}
        value={props.candidato.porcentaje}
      ></ProgressBar>
    </div>
  );
}
