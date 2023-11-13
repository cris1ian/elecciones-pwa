const useLocalBackend: boolean = true;

const localhost: string = 'http://192.168.0.8:3001';
const staging: string = 'https://api.mesastesti.com.ar:3001';
const production: string = 'https://api.mesastesti.com.ar:3001';

export const REST_URL = !process.env.isProduction ? production :
    useLocalBackend ? localhost : staging;
