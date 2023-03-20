import { JwtModuleOptions } from "@nestjs/jwt";
import { DataSourceOptions } from "typeorm";

export interface ConfigurationOptions {
    database: DataSourceOptions;
    jwt_options: JwtModuleOptions;
}