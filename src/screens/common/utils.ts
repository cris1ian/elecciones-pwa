import { confirmDialog } from "primereact/confirmdialog";
import { NavigateFunction } from "react-router-dom";
import * as Storage from "../../utils/storage";

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