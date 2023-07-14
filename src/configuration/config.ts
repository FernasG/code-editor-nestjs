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
    hackerearth_api_key: process.env.HACKEREARTH_API_KEY,
    hackerearth_callback_url: process.env.HACKEREARTH_CALLBACK_URL,
    aws: {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    },
    s3_bucket: process.env.AWS_S3_BUCKET
}));