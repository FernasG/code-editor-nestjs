declare namespace NodeJS {
    interface ProcessEnv {
        HACKEREARTH_CALLBACK_URL: string;
        DATABASE_CONNECTION_URL: string;
        HACKEREARTH_API_KEY: string;
        JWT_SECRET_KEY: string;
    }
}