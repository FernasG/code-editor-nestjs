import { DataSourceOptions } from "typeorm";

export interface ConfigurationOptions {
    database: DataSourceOptions;
}