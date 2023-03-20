declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_CONNECTION_URL: string;
        JWT_SECRET_KEY: string;
    }
}