import { Candidato } from "models/candidato.model";
import { Categoria } from "models/categoria.model";
import { MesaCandidato } from "models/mesa-candidato.model";
import { Mesa } from "models/mesa.model";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validarDatos } from "screens/common/ValidarDatos";
import { logout } from "screens/common/utils";
import * as auth from "services/auth.service";
import { CargaCandidato } from "./CargaCandidato";
import styles from "./Carga.module.scss";

export function CargaDeDatos() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);

  /** ID de Punto Muestral */
  const puntoMuestralId: string | undefined = location?.state?.puntoMuestralId;

  const [spinner, setSpinner] = useState<boolean>(false);

  /** Listas de Datos */
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mesasCandidatos, setMesasCandidatos] = useState<MesaCandidato[]>([]);

  /** Valores seleccionados */
  const [mesa, setMesa] = useState<Mesa>();
  const [categoria, setCategoria] = useState<Categoria | undefined>();

  useEffect(() => {
    if (!puntoMuestralId) return;
    getMesasByPuntoMuestral();
  }, [puntoMuestralId]);

  useEffect(() => {
    if (!mesa) return;
    onChangeMesa(mesa);
  }, [mesa]);

  useEffect(() => {
    onChangeCategoria(categoria);
  }, [categoria]);

  const clearAll = (excepMesa = false) => {
    setMesasCandidatos([]);
    setCategorias([]);
    setCategoria(undefined);
    if (!excepMesa) setMesa(undefined);
  };

  const getMesasByPuntoMuestral = async () => {
    if (puntoMuestralId === undefined) return;
    let resp: Mesa[] | undefined;
    try {
      resp = await auth.getMesasByPuntoMuestral(+puntoMuestralId);
    } catch (error) {
      console.log(error);
      return;
    }
    if (!resp) return;
    setMesas(resp);
  };

  const onChangeMesa = async (mesa: Mesa) => {
    if (puntoMuestralId === undefined) return;
    clearAll(true);
    let resp: Categoria[] | undefined;
    try {
      resp = await auth.getCategoriasByMesaAndPuntoMuestral(+puntoMuestralId, mesa);
    } catch (error) {
      console.log(error);
      return;
    }
    if (!resp) return;
    setCategorias(resp);
  };

  /**
   * Cargo los candidatos de la categoria seleccionada
   * Me creo las nuevas mesasCandidatos que voy a mandar
   */
  const onChangeCategoria = async (categoria: Categoria | undefined) => {
    if (mesa === undefined) return;
    if (!categoria) return setMesasCandidatos([]);

    let resp: Candidato[] | undefined;
    try {
      resp = await auth.getCandidatosByCategoria(categoria.id);
    } catch (error) {
      console.log(error);
      return;
    }
    if (!resp) return;

    const _sortedCandidatos: Candidato[] = resp.sort((a: Candidato, b: Candidato) => a.candidatoTipo - b.candidatoTipo);
    const _mesasCandidatos: MesaCandidato[] = _sortedCandidatos.map(
      (c: Candidato) => new MesaCandidato({ mesa: mesa, candidato: c })
    );
    setMesasCandidatos(_mesasCandidatos);
  };

  const cargarMesa = async (_mesasCandidatos: MesaCandidato[], _mesa: Mesa, _categoria: Categoria) => {
    let resp: any | undefined;
    try {
      setSpinner(true);
      resp = await auth.postMesasCandidatos(_mesasCandidatos, _mesa, _categoria);
    } catch (error) {
      console.log(error);
      setSpinner(false);
      return;
    }
    setSpinner(false);
    if (!resp) return;
    clearAll();
  };

  const onClickConfirmar = async () => {
    const datosValidos: boolean = validarDatos(mesasCandidatos, toast);
    if (!datosValidos) return;

    if (mesa === undefined) return;
    if (categoria === undefined) return;

    confirmDialog({
      message: "Una vez cargados los datos no pueden volver a editarse",
      header: "¿Cargar Mesa?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "No",
      acceptLabel: "Sí",
      accept: () => cargarMesa(mesasCandidatos, mesa, categoria),
    });
  };

  const setCantidadVotos = (value: number, _mesaCandidato: MesaCandidato): void => {
    const _editedMesaCandidato: MesaCandidato = { ..._mesaCandidato, cantidadVotos: +value };
    let _editedMesasCandidatos: MesaCandidato[] = mesasCandidatos.map((e: MesaCandidato) =>
      e.candidato.id === _mesaCandidato.candidato.id ? _editedMesaCandidato : e
    );
    setMesasCandidatos(_editedMesasCandidatos);
  };

  const doLogout = () => {
    logout(navigate);
  };

  return (
    <div>
      <ConfirmDialog />
      <div className="cris-title">
        Ingreso de resultados
        <Button onClick={doLogout} style={{ color: "white" }} icon="pi pi-sign-out" rounded text outlined />
      </div>

      <div className="flex flex-column justify-content-center align-items-center p-3">
        <Toast ref={toast} position="bottom-center" />
        <Dropdown
          value={mesa}
          onChange={(e: DropdownChangeEvent) => setMesa(e.value)}
          options={mesas}
          optionLabel="descripcion"
          placeholder="Seleccione mesa"
          className="w-full mb-3"
          emptyMessage="No hay resultados"
        />
        <Dropdown
          value={categoria}
          onChange={(e: DropdownChangeEvent) => setCategoria(e.value)}
          options={categorias}
          optionLabel="descripcion"
          placeholder="Seleccione categoria"
          className="w-full mb-3"
          emptyMessage="No hay resultados"
        />
      </div>

      {mesasCandidatos.length > 0 && (
        <>
          <div className={styles.sectionTitle}>Ingrese cantidad de votos</div>
          <div className="p-3">
            {mesasCandidatos.map((elem: MesaCandidato) => (
              <CargaCandidato mesaCandidato={elem} setVotos={setCantidadVotos} key={elem.candidato.id} />
            ))}
          </div>
          <div className="mb-5 flex justify-content-center">
            <Button
              className={styles.button}
              label="Confirmar"
              onClick={onClickConfirmar}
              disabled={spinner || !categoria}
              loading={spinner}
            />
          </div>
        </>
      )}
    </div>
  );
}
