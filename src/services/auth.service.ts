import { REST_URL } from "../constants/api";
import axios, { AxiosResponse } from "axios"
import { Mesa } from "../models/mesa.model";
import { PuntoMuestralRaw } from "../models/punto-muestral.model";
import { Candidato } from "../models/candidato.model";
import { Categoria } from "../models/categoria.model";
import { MesaCandidato } from "../models/mesa-candidato.model";
import { Resultado } from "../models/resultado.model";
import { PictureCamera } from "../models/picture-camera.interface";
import { errorCatcher } from "utils/error-handler";

export interface ResponseType1 {
    body: string,
    status: string,
}

/**
 * Retorna un Observable con todas las categorias
 */
export const getCategoriasByMesaAndPuntoMuestral = async (idPuntoMuestral: number, mesa: Mesa): Promise<Categoria[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas/${mesa.id}/categorias`;

    try {
        const resp: AxiosResponse<any> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<Categoria[]>(
    //     // `${REST_URL}/categoria`
    //     `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas/${mesa.id}/categorias`
    // )
}

/**
 * Retorna un Observable con todas las mesas de un punto muestral dado
 */
export const getMesasByPuntoMuestral = async (idPuntoMuestral: number): Promise<Mesa[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas`;

    try {
        const resp: AxiosResponse<Mesa[]> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<Mesa[]>(
    //     `${REST_URL}/punto_muestral/${idPuntoMuestral}/mesas`
    // )
}

/**
 * Retorna un Observable el puntoMuestral dado un celular
 */
export const getPuntoMuestralByCelular = async (celular: string): Promise<PuntoMuestralRaw[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${celular}`;

    try {
        const resp: AxiosResponse<PuntoMuestralRaw[]> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<PuntoMuestral[]>(
    //     `${REST_URL}/punto_muestral/${celular}`
    // )
}

/**
 * Retorna un Observable los candidatos dada una categoria
 */
export const getCandidatosByCategoria = async (idCategoria: number): Promise<Candidato[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/categoria/${idCategoria}/candidatos`;

    try {
        const resp: AxiosResponse<Candidato[]> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<Candidato[]>(
    //     `${REST_URL}/categoria/${idCategoria}/candidatos`
    // )
}

/**
 * Inseta en la db todos los nuevos mesasCandidatos
 */
export const postMesasCandidatos = async (mesasCandidatos: MesaCandidato[], mesa: Mesa, categoria: Categoria, picture?: PictureCamera): Promise<any> => {
    const ENDPOINT: string = `${REST_URL}/mesa-candidato/${mesa.descripcion}/${categoria.descripcion}`;

    const formData = new FormData();

    formData.append('mesasCandidatos', JSON.stringify(mesasCandidatos));

    try {
        const resp: AxiosResponse<any> = await axios.post(ENDPOINT, formData);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // return {
    //     this.http.post(`${REST_URL}/mesa-candidato/${mesa.descripcion}/${categoria.descripcion}`, formData);
    // }
}

/**
 * Retorna un Observable con los resultados
 */
export const getResultados = async (idCategoria: any, idMesa: any): Promise<Resultado[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/resultados/${idCategoria}/${idMesa}`;

    try {
        const resp: AxiosResponse<Resultado[]> = await axios.get(ENDPOINT);
        const _mappedResp: Resultado[] = resp.data.map((elem: any) => new Resultado(elem));
        return _mappedResp
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<any[]>(
    //     `${REST_URL}/resultados/${idCategoria}/${idMesa}`
    // ).pipe(
    //     map((resp: any) => resp.map(a => new Resultado(a)))
    // )
}

/**
 * Retorna TODAS las categorias en un Observable
 */
export const getAllCategorias = async (): Promise<Categoria[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/categorias`;

    try {
        const resp: AxiosResponse<Categoria[]> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<Categoria[]>(
    //     `${REST_URL}/categorias`
    // )
}

/**
 * Retorna TODAS las mesas en un Observable
 */
export const getAllMesas = async (): Promise<Mesa[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/mesas`;

    try {
        const resp: AxiosResponse<Mesa[]> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<Mesa[]>(
    //     `${REST_URL}/mesas`
    // )
}

/**
 * Reportar presencia
 */
export const setRegistroIngreso = async (celular: string, newRegistroIngreso: boolean): Promise<ResponseType1 | undefined> => {
    const ENDPOINT: string = `${REST_URL}/punto_muestral/${celular}`;
    const body: any = { registroIngreso: newRegistroIngreso ? 1 : 0 };

    try {
        const resp: AxiosResponse<any> = await axios.post(ENDPOINT, body);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.post(
    //     `${REST_URL}/punto_muestral/${celular}`,
    //     {
    //         registroIngreso: newRegistroIngreso ? 1 : 0
    //     }
    // )
}

/**
 * 
 */
export const getPuntosInformados = async (idCategoria: number): Promise<string | undefined> => {
    const ENDPOINT: string = `${REST_URL}/puntos-informados/${idCategoria}`;

    try {
        const resp: AxiosResponse<any> = await axios.get(ENDPOINT);
        const firstElem: any = (resp.data && resp.data.length > 0) ? resp.data[0][""] : '';
        return firstElem
        // return resp
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get(
    //     `${REST_URL}/puntos-informados/${idCategoria}`
    // ).pipe(
    //     map(
    //         (resp: any[]) => resp && resp.length > 0 ?
    //             resp[0][''] : ''
    //     )
    // )
}

/**
 * Retorna TODAS las localidades
 */
export const getAllLocalidades = async (): Promise<string[] | undefined> => {
    const ENDPOINT: string = `${REST_URL}/localidad`;

    try {
        const resp: AxiosResponse<string[]> = await axios.get(ENDPOINT);
        return resp.data
    } catch (error) {
        return errorCatcher(error as any)
    }

    // this.http.get<Mesa[]>(
    //     `${REST_URL}/mesas`
    // )
}