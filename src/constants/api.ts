const useLocalBackend: boolean = true;

const apiUrl: string = process.env.REACT_APP_API_URL || "";
const port: string = process.env.REACT_APP_PORT || "";
const isProduction: boolean = process.env.NODE_ENV === "production";

const localhost: string = `http://192.168.0.8:${port}`;
const staging: string = `${apiUrl}:${port}`;
const production: string = `${apiUrl}:${port}`;

export const REST_URL = isProduction ? production :
    useLocalBackend ? localhost : staging;
