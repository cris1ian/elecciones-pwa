export type TipoPuntoMuestral = typeof TiposPuntosMuestrales[keyof typeof TiposPuntosMuestrales];

export const TiposPuntosMuestrales = {
    TD: 1,
    CANDIDATO: 2,
};