import candidatosTipos from "constants/candidatos-tipos";
import { MesaCandidato } from "models/mesa-candidato.model";
import { Toast } from "primereact/toast";
import { RefObject } from "react";
import { showToastMessage } from "./utils";
import { MAX_VOTOS } from "constants/reglas-de-negocio";

/** Valido los datos antes de enviarlos */
export const validarDatos = (mesasCandidatos: MesaCandidato[], toastRef: RefObject<Toast>): boolean => {
  // Primero compruebo que ningun campo sea nulo, o 0, o texto
  // const camposNulos = mesasCandidatos.some((mc: MesaCandidato) => !mc.cantidadVotos || mc.cantidadVotos === 0)

  // if (camposNulos) {
  //     showToastMessage('Error', `Falta completar algun campo, o alguno es 0`,toastRef,"warn");
  //     return false
  // }

  // RN: Candidato total votos tiene que ser menor o igual a 350
  const candidatoTotalVotos: MesaCandidato | undefined = mesasCandidatos.find(
    (mc) => mc.candidato.candidatoTipo === candidatosTipos.TOTAL_VOTOS
  );

  if (candidatoTotalVotos === undefined || candidatoTotalVotos === null) {
    showToastMessage("Error", `candidatoTotalVotos no está definido o es null`, toastRef, "warn");
    return false;
  }

  if (candidatoTotalVotos.cantidadVotos === undefined || candidatoTotalVotos.cantidadVotos === null) {
    showToastMessage("Error", `Total de Votos Candidato es null`, toastRef, "warn");
    return false;
  }

  if (candidatoTotalVotos.cantidadVotos > MAX_VOTOS) {
    showToastMessage("Error", `Total Votos supera la cantidad máxima permitida: ${MAX_VOTOS}`, toastRef, "warn");
    return false;
  }

  // RN: Sumatoria candidatos exceptuando total votos y total votos validos
  const sumTotalVotos: number = mesasCandidatos
    .filter(
      (mc) =>
        mc.candidato.candidatoTipo !== candidatosTipos.TOTAL_VOTOS &&
        mc.candidato.candidatoTipo !== candidatosTipos.TOTAL_VOTOS_VALIDO
    )
    .reduce((acc, mc) => acc + Number(mc.cantidadVotos), 0);

  // RN: Los votos no pueden superar el Maximo de votos (350)
  if (sumTotalVotos > MAX_VOTOS) {
    showToastMessage(
      "Error",
      `La suma de los votos de cada candidato supera la cantidad máxima permitida: ${MAX_VOTOS}`,
      toastRef,
      "warn"
    );
    return false;
  }

  const candidatoTotalVotosValido: MesaCandidato | undefined = mesasCandidatos.find(
    (mc) => mc.candidato.candidatoTipo === candidatosTipos.TOTAL_VOTOS_VALIDO
  );

  if (candidatoTotalVotosValido === undefined || candidatoTotalVotosValido === null) {
    showToastMessage("Error", `candidatoTotalVotos no está definido o es null`, toastRef, "warn");
    return false;
  }

  if (candidatoTotalVotosValido.cantidadVotos === undefined || candidatoTotalVotosValido.cantidadVotos === null) {
    showToastMessage("Error", `Total de Votos Candidato es null`, toastRef, "warn");
    return false;
  }

  // RN: Candidato Total Votos Valido tiene que ser <= a Total votos // Esta condición aplicaba en la versión 2019
  // if (candidatoTotalVotosValido.cantidadVotos > candidatoTotalVotos.cantidadVotos) {
  //     showToastMessage('Error', `Total Votos Valido tiene que ser mayor o igual a la suma de los votos de los candidatos`,toastRef,"warn");
  //     return false;
  // }

  // RN: Candidato Total Votos Valido tiene que ser = a Total votos.
  // En la versión 2021 usamos el campo para rechequear que no le haya errado en la carga
  // No representa el valor de votos validos y totales sino el mismo campo por duplicado
  if (candidatoTotalVotosValido.cantidadVotos != candidatoTotalVotos.cantidadVotos) {
    showToastMessage("Error", `La cantidad de Votos y Votos(repetir) no coinciden`, toastRef, "warn");
    return false;
  }

  // RN: Candidato Total Votos Valido tiene que ser >= a la suma de los votos de los candidatos
  if (candidatoTotalVotosValido.cantidadVotos < sumTotalVotos) {
    showToastMessage("Error", `Total Votos Valido tiene que ser menor o igual a Total votos`, toastRef, "warn");
    return false;
  }

  return true;
};
