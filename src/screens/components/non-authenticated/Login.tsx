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
import * as Storage from "../../../utils/storage";

export function Login() {
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const [celular, setCelular] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [spinner, setSpinner] = React.useState<boolean>(false);

  const showMessage = (title: string, message: string, severity?: ToastMessageOptions["severity"]) => {
    if (toast.current === null) return;
    toast.current.show({
      severity: severity || "info",
      summary: title,
      detail: message,
    });
  };

  const getPuntoMuestral = async (_celular: string, _password: string): Promise<PuntoMuestralRaw | undefined> => {
    let resp: PuntoMuestralRaw[] | undefined;
    try {
      setSpinner(true);
      resp = await auth.logIn(_celular, _password);
    } catch (error) {
      setSpinner(false);
      return;
    }
    setSpinner(false);
    if (!resp || !resp[0]) showMessage("Error", "No se halló el usuario", "warn");
    return resp?.[0];
  };

  const setRegistroDeIngreso = async (_celular: string): Promise<void> => {
    let resp: ResponseType1 | undefined;
    try {
      setSpinner(true);
      resp = await auth.setRegistroIngreso(_celular, true);
    } catch (error) {
      setSpinner(false);
    }
    setSpinner(false);
    if (!resp) {
      showMessage("Error", "No se pudo reportar presencia", "error");
      return;
    }
    showMessage(resp.body, resp.status, "success");
  };

  const onClickIngresar = async () => {
    if (!celular) return showMessage("Error", "No se ingresó un número válido", "warn");
    if (!password) return showMessage("Error", "No se ingresó contraseña", "warn");

    const resp: PuntoMuestralRaw | undefined = await getPuntoMuestral(celular, password);
    if (!resp) return;
    const puntoMuestral: PuntoMuestral = new PuntoMuestral(resp);

    if (!puntoMuestral.registroIngreso) await setRegistroDeIngreso(celular);

    const navigateTo: string =
      puntoMuestral.idTipo === TiposPuntosMuestrales.TD ? `home/${puntoMuestral.id}` : `reportes`;

    Storage.setObject("user", puntoMuestral.celular);
    Storage.setObject("tipo", puntoMuestral.idTipo);
    navigate(navigateTo);
  };

  return (
    <div className="h-full">
      <Toast ref={toast} position="top-center" />
      <div className="main-header">Ingreso</div>
      <div className="desktop-wrapper">
        <form>
          <div className="flex flex-column justify-content-center align-items-center">
            <div className={classNames(styles.inputHeight, "cris-height-08 flex flex-column justify-content-evenly")}>
              {/* Input Form */}
              <div className="align-items-center flex flex-column my-5">
                <div className="p-float-label mb-5">
                  <InputText
                    className={styles.mainInput}
                    type="number"
                    id="username"
                    pattern="[0-9]*"
                    value={celular}
                    keyfilter="int"
                    onKeyDown={allowOnlyNumbers}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setCelular(event.target.value);
                    }}
                  />
                  <label htmlFor="username" className="font-bold block mb-2">
                    Código asignado
                  </label>
                </div>
                <div className="p-float-label mb-5">
                  <InputText
                    className={styles.mainInput}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    pattern="[0-9]*"
                    value={password}
                    onKeyDown={allowOnlyNumbers}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setPassword(event.target.value);
                    }}
                  />
                  <label htmlFor="password" className="font-bold block mb-2">
                    Contraseña
                  </label>
                  <Button
                    className={styles.floatingEyeball}
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    icon={showPassword ? "pi pi-eye" : "pi pi-eye-slash"}
                    rounded
                    text
                  />
                </div>
              </div>
            </div>
            {/* <Button
              className={classNames("mb-3", styles.button)}
              label="Reportar Presencia"
              rounded
              outlined
              onClick={onClickReportarPresencia}
              disabled={!celular}
              loading={spinner}
            /> */}
            {/* Input Form */}
            <Button
              className={classNames("mb-3", styles.button)}
              rounded
              type="submit"
              label="Ingresar"
              onClick={() => onClickIngresar()}
              disabled={!celular || !password}
              loading={spinner}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
