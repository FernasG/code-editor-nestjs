import { ConfigurationOptions } from "./config.interface";

export default ((): ConfigurationOptions => ({
    database: {
        type: 'postgres',
        url: process.env.DATABASE_CONNECTION_URL,
        entities: ['**/entities/*.entity.{js,ts}']
    }
}));