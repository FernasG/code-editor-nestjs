import { ConfigurationOptions } from './config.interface';

export default ((): ConfigurationOptions => ({
    database: {
        type: 'postgres',
        url: process.env.DATABASE_CONNECTION_URL,
        entities: ['dist/**/entities/*.entity.{js,ts}']
    },
    jwt_options: {
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '8h' }
    },
    hackerearth_api_key: process.env.HACKEREARTH_API_KEY
}));