import React, { ChangeEvent, useRef, useState } from "react";
import styles from "./Login.module.scss";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Toast, ToastMessageOptions } from "primereact/toast";
import { PuntoMuestral, PuntoMuestralRaw } from "models/punto-muestral.model";
import * as auth from "services/auth.service";
import { ResponseType1 } from "services/auth.service";
import { TiposPuntosMuestrales } from "constants/tipos-puntos-muestrales";
import { allowOnlyNumbers } from "utils/keyboard-utils";
import { useNavigate } from "react-router-dom";
import * as Storage from "../../utils/storage";

export function Login() {
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);
  const [celular, setCelular] = useState<string>("");
  const [spinner, setSpinner] = React.useState<boolean>(false);

  const showMessage = (title: string, message: string, severity?: ToastMessageOptions["severity"]) => {
    if (toast.current === null) return;
    toast.current.show({
      severity: severity || "info",
      summary: title,
      detail: message,
    });
  };

  const getPuntoMuestral = async (_celular: string): Promise<PuntoMuestralRaw | undefined> => {
    let resp: PuntoMuestralRaw[] | undefined;
    try {
      setSpinner(true);
      resp = await auth.getPuntoMuestralByCelular(_celular);
    } catch (error) {
      setSpinner(false);
      console.log(error);
      return undefined;
    }
    setSpinner(false);
    if (!resp || !resp[0]) showMessage("Error", "No se halló el número ingresado", "error");
    return resp?.[0];
  };

  const setRegistroDeIngreso = async (_celular: string): Promise<void> => {
    let resp: ResponseType1 | undefined;
    try {
      setSpinner(true);
      resp = await auth.setRegistroIngreso(_celular, true);
    } catch (error) {
      setSpinner(false);
      console.log(error);
    }
    setSpinner(false);
    if (!resp) {
      showMessage("Error", "No se pudo reportar presencia", "error");
      return;
    }
    showMessage(resp.body, resp.status, "success");
  };

  const onClickReportarPresencia = async () => {
    if (!celular) return showMessage("Error", "No se ingresó un número válido", "error");

    const resp1: PuntoMuestralRaw | undefined = await getPuntoMuestral(celular);
    if (!resp1) return;
    const puntoMuestral: PuntoMuestral = new PuntoMuestral(resp1);

    if (puntoMuestral.registroIngreso) return showMessage("Info", "Usted ya ha reportado su presencia");

    setRegistroDeIngreso(celular);
  };

  const onClickIngresar = async () => {
    if (!celular) return showMessage("Error", "No se ingresó un número válido", "error");

    const resp1: PuntoMuestralRaw | undefined = await getPuntoMuestral(celular);
    if (!resp1) return;
    const puntoMuestral: PuntoMuestral = new PuntoMuestral(resp1);

    const faltaReportar: boolean = puntoMuestral.idTipo === TiposPuntosMuestrales.TD && !puntoMuestral.registroIngreso;

    /** Analizar aquí la posiblidad de hacer el reporte de presencia de forma automática */
    if (faltaReportar) return showMessage("Info", "Antes de ingresar debe reportar su presencia");

    const navigateTo: string = puntoMuestral.idTipo === TiposPuntosMuestrales.TD ? `home` : `reportes`;

    Storage.setObject("user", puntoMuestral.celular);
    Storage.setObject("tipo", puntoMuestral.idTipo);
    navigate(navigateTo, { state: { puntoMuestralId: puntoMuestral.id } });
  };

  return (
    <div className="h-full">
      <Toast ref={toast} position="bottom-center" />
      <div className="cris-title">Ingreso</div>
      <div className="flex flex-column justify-content-center align-items-center">
        <div className={classNames(styles.inputHeight, "cris-height-08 flex flex-column justify-content-center")}>
          <div className="align-items-center flex flex-column mb-5">
            <label htmlFor="phone" className="font-bold block mb-2">
              Ingrese celular o código asignado
            </label>
            <InputText
              className={styles.mainInput}
              id="phone"
              type="number"
              pattern="[0-9]*"
              placeholder="341 123 4567"
              value={celular}
              onKeyDown={allowOnlyNumbers}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setCelular(event.target.value);
              }}
            ></InputText>
          </div>
        </div>
        <Button
          className={classNames("mb-3", styles.button)}
          label="Reportar Presencia"
          outlined
          onClick={onClickReportarPresencia}
          disabled={!celular}
          loading={spinner}
        />
        <Button
          className={classNames("mb-3", styles.button)}
          label="Ingresar"
          onClick={onClickIngresar}
          disabled={!celular}
          loading={spinner}
        />
      </div>
    </div>
  );
}
