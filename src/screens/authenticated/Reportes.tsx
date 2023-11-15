import { Categoria } from "models/categoria.model";
import { Mesa } from "models/mesa.model";
import { Resultado } from "models/resultado.model";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef } from "react";
import * as auth from "services/auth.service";
import styles from "./Reportes.module.scss";
import { CandidatoDisplay } from "./CandidatoDisplay";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { logout, showToastMessage } from "screens/common/utils";
import { useNavigate } from "react-router-dom";

export function Reports() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [spinner, setSpinner] = React.useState<boolean>(false);

  /** Listas de Datos */
  const [mesas, setMesas] = React.useState<Mesa[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [localidades, setLocalidades] = React.useState<string[]>([]);

  /** Datos Seleccionados */
  const [categoria, setCategoria] = React.useState<Categoria | null>(null);
  const [localidadSeleccionada, setLocalidadSeleccionada] = React.useState<string>("");

  /** Resultados */
  const [resultados, setResultados] = React.useState<Resultado[]>([]);
  const [puntosInformadosMsg, setPuntosInformadosMsg] = React.useState<string>("");

  useEffect(() => {
    getAllCategorias();
    getAllMesas();
    getAllLocalidades();
  }, []);

  useEffect(() => {
    if (categorias.length === 0) return;
    refrescarLista(categoria ? categoria : categorias[0], localidadSeleccionada);
  }, [categoria, localidadSeleccionada]);

  const getAllCategorias = async () => {
    let resp;
    try {
      resp = await auth.getAllCategorias();
    } catch (error: any) {
      return showToastMessage("Error", JSON.stringify(error), toast, "error");
    }
    if (!resp) return;
    setCategorias(resp);

    // Categoria por defecto: la primera del array
    if (resp.length > 0) setCategoria(resp[0]);
    const categoriaDefault: Categoria = resp[0];
    refrescarLista(categoriaDefault);
  };

  const getAllMesas = async () => {
    let resp;
    try {
      resp = await auth.getAllMesas();
    } catch (error) {
      return showToastMessage("Error", JSON.stringify(error), toast, "error");
    }
    if (!resp) return;
    setMesas(resp);
  };

  const getAllLocalidades = async () => {
    let resp;
    try {
      resp = await auth.getAllLocalidades();
    } catch (error) {
      console.log(error);
      return;
    }
    if (!resp) return;
    setLocalidades(resp);
  };

  const getPuntosInformados = async (_categoria: Categoria) => {
    let resp: string | undefined;
    try {
      setSpinner(true);
      resp = await auth.getPuntosInformados(_categoria?.id || 0);
    } catch (error) {
      showToastMessage("Error", JSON.stringify(error), toast, "error");
      setSpinner(false);
      return;
    }
    if (!resp) return setSpinner(false);
    setPuntosInformadosMsg(resp);
  };

  const getResultados = async (_categoria: Categoria, _localidad?: string) => {
    const _localidadDefinida: boolean = _localidad !== undefined && _localidad !== "";

    let resp;
    try {
      setSpinner(true);
      resp = await auth.getResultados(_categoria ? _categoria.id : 0, _localidadDefinida ? _localidad : 0);
    } catch (error) {
      showToastMessage("Error", JSON.stringify(error), toast, "error");
      setSpinner(false);
      return;
    }
    setSpinner(false);
    if (!resp) return;
    const resultadosOrdenados: Resultado[] = resp.sort((a, b) => (a.porcentaje > b.porcentaje ? -1 : 1));
    setResultados(resultadosOrdenados);
  };

  const refrescarLista = async (cat?: Categoria, loc?: string) => {
    const _categoria: Categoria = cat || (categoria ? categoria : categorias[0]);
    const _localidad: string = loc || localidadSeleccionada;
    getPuntosInformados(_categoria);
    getResultados(_categoria, _localidad);
  };

  const doLogout = () => {
    logout(navigate);
  };

  return (
    <div>
      <ConfirmDialog />
      <div className="cris-title">
        Resumen de resultados
        <Button onClick={doLogout} style={{ color: "white" }} icon="pi pi-sign-out" rounded text outlined />
      </div>

      <div className={styles.loadingContainer}>
        {spinner ? <ProgressBar mode="indeterminate" color={"#2089dc"} style={{ height: "6px" }}></ProgressBar> : null}
      </div>

      <div className="flex flex-column justify-content-center align-items-center p-3">
        <Toast ref={toast} position="bottom-center" />
        <Dropdown
          value={categoria}
          onChange={(e: DropdownChangeEvent) => setCategoria(e.value)}
          options={categorias}
          optionLabel="descripcion"
          placeholder="Seleccione categoría"
          className="w-full mb-3"
          emptyFilterMessage="No hay coincidencias"
          emptyMessage="No hay resultados"
        />
        <Dropdown
          filter
          showClear
          value={localidadSeleccionada}
          onChange={(e: DropdownChangeEvent) => setLocalidadSeleccionada(e.value)}
          options={localidades}
          placeholder="Filtrar por ciudad"
          className="w-full mb-3"
          emptyFilterMessage="No hay coincidencias"
          emptyMessage="No hay resultados"
        />
      </div>

      <div className="px-3 flex justify-content-between align-items-center">
        {puntosInformadosMsg}
        <Button onClick={() => refrescarLista()} icon="pi pi-refresh" rounded loading={spinner} />
      </div>

      <div className="p-3">
        {resultados.length === 0 ? <div className={styles.noData}>Aún no hay {"\n"} información cargada</div> : null}

        {resultados.map((elem: Resultado) => (
          <CandidatoDisplay candidato={elem} key={elem.candidatoNombre} />
        ))}
      </div>
    </div>
  );
}
