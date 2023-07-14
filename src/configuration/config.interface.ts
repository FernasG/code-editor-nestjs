import { JwtModuleOptions } from '@nestjs/jwt';
import { DataSourceOptions } from 'typeorm';

export interface ConfigurationOptions {
    database: DataSourceOptions;
    jwt_options: JwtModuleOptions;
    hackerearth_api_key: string;
    hackerearth_callback_url: string;
    aws: {
        region: string;
        credentials: {
            accessKeyId: string;
            secretAccessKey: string;
        }
    };
    s3_bucket: string;
}