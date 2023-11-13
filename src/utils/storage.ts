// Implementar esto:
// const token = typeof storedObject == 'string' ? JSON.parse(storedObject) : undefined;

/**
 * Guardar elemento en el localStorage
 */
export const setObject = (key: string, value: any): void => {
    const castAsString = typeof value === 'string' ? value : JSON.stringify(value);
    return localStorage.setItem(key, castAsString)
}

const quotesRegex = /^"(.*)"$/;
/**
 * Obtener elemento del localStorage
 */
export const getObject = (key: string): string | null => {
    let value: string | null = localStorage.getItem(key);
    /** Reemplazar strings si fue guardado con comillas (error generado por JSON.stringify cuando se trata de un string y no un objeto) */
    if (typeof value === 'string') value = value.replace(quotesRegex, '$1');
    return value
}

/**
 * Limpia elemento del local storage
 */
export const clearObject = (key: string): void => {
    return localStorage.removeItem(key)
}

/**
 * Limpia todo el local storage
 */
export const clearAll = (): void => {
    return localStorage.clear();
}