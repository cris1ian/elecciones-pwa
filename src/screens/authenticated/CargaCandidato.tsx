import { MesaCandidato } from "models/mesa-candidato.model";
import { Avatar } from "primereact/avatar";
import React from "react";
import styles from "./Carga.module.scss";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { splitName } from "screens/common/utils";
import { MAX_VOTOS } from "constants/reglas-de-negocio";
import { Nullable } from "primereact/ts-helpers";

interface Props {
  mesaCandidato: MesaCandidato;
  setVotos: (value: number, _mesaCandidato: MesaCandidato) => void;
}

export function CargaCandidato(props: Props) {
  const obtenerNumeroDeLista = (value: string): string => value.match(/\d+/)?.[0] || "-";

  const onValueChange = (value: Nullable<number>) => {
    if (value) props.setVotos(value, props.mesaCandidato);
  };

  return (
    <div className="mb-3">
      <div
        className={classNames("flex align-items-center justify-content-between", styles.cargaCandidatoContainer)}
        style={{ backgroundColor: props.mesaCandidato.candidato.color }}
      >
        <div className={classNames("flex justify-content-center")}>
          <Avatar
            className={styles.avatar}
            label={obtenerNumeroDeLista(props.mesaCandidato.candidato.nombre)}
            image={props.mesaCandidato.candidato.urlimagen}
            style={{ backgroundColor: "transparent", borderRadius: "50%", fontSize: "1.5rem" }}
            size="xlarge"
            shape="circle"
          />
        </div>
        <div className="pl-3 flex flex-grow-1">
          <label className={styles.nombre}>{splitName(props.mesaCandidato.candidato.nombre)}</label>
        </div>
        <div className="mr-3">
          <InputNumber
            locale="es-AR"
            size={50}
            inputStyle={{
              width: "4rem",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "large",
              borderRadius: "50px",
            }}
            inputId="minmax"
            placeholder="0"
            value={props.mesaCandidato.cantidadVotos}
            onValueChange={(e: InputNumberValueChangeEvent) => onValueChange(e.value)}
            min={0}
            max={MAX_VOTOS}
          />
        </div>
      </div>
    </div>
  );
}
