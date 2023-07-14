declare namespace NodeJS {
    interface ProcessEnv {
        HACKEREARTH_CALLBACK_URL: string;
        DATABASE_CONNECTION_URL: string;
        HACKEREARTH_API_KEY: string;
        JWT_SECRET_KEY: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_KEY: string;
        AWS_REGION: string;
        AWS_S3_BUCKET: string;
    }
}