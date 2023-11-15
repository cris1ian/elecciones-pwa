import { confirmDialog } from "primereact/confirmdialog";
import { NavigateFunction } from "react-router-dom";
import * as Storage from "../../utils/storage";
import { Toast, ToastMessageOptions } from "primereact/toast";
import { RefObject } from "react";

export const splitName = (value: string): string => value.replace(/\(/g, "\n").replace(/\)/g, "");
export const formatNumber = (value: number): string => value.toLocaleString("es-AR");

export const logout = (navigate: NavigateFunction): void => {

    confirmDialog({
        message: '¿Desea cerrar sesión?',
        header: 'Atención',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: "No",
        acceptLabel: "Sí",
        accept: () => {
            Storage.clearAll();
            navigate("/");
            window.history.replaceState({}, document.title)
        }
    });

}

export const showToastMessage = (title: string, message: string, toastRef: RefObject<Toast>, severity?: ToastMessageOptions["severity"]) => {
    if (toastRef.current === null) return;
    toastRef.current.show({
        severity: severity || "info",
        summary: title,
        detail: message,
    });
};