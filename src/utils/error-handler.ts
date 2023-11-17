import { AxiosError } from "axios";

const displayError = (mensaje: RedirectMessage) => {
    // const toast = useRef<Toast>(null);
    // // toast.current.show({
    // //     severity: "info",
    // //     summary: mensaje.title,
    // //     detail: mensaje.msg,
    // // });
    // confirmDialog({
    //     header: mensaje.title,
    //     message: mensaje.msg,
    //     icon: "pi pi-exclamation-triangle",
    //     rejectLabel: "No",
    //     acceptLabel: "Sí",
    // });
}

/**
 * Error handler
 * @param {AxiosError} error
 */
export const errorCatcher = (error: AxiosError<any>): undefined => {
    let errorCode: string = error.response?.data?.error?.code || error.response?.status || "";

    displayError(ErrorResponses[errorCode]);

    return

}

type RedirectMessage = {
    title: string;
    msg: string;
};

const ErrorResponses: { [key: string]: RedirectMessage } = {
    "301": { title: "Está siendo redirigido", msg: "Aguarde unos momentos..." },
    "400": { title: "Error al intentar realizar esta operación.", msg: `Intente nuevamente en unos minutos. Si el error persiste comunicarse con su representante comercial.` },
    "401": { title: "No encontrado", msg: `Verifique los datos enviados` },
    "404": { title: "No encontrado", msg: `Verifique los datos enviados` },
    "504": { title: "El servidor tardó demasiado en responder", msg: `Reintente en unos momentos...` },
    "": { title: "Algo salió mal!", msg: 'Error desconocido' },
};