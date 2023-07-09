import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodespacesService } from './codespaces.service';
import { CodespacesController } from './codespaces.controller';
import { HackerEarthModule, RequestModule, StorageModule, UtilsModule } from '@libraries';
import { Codespaces } from '@database';

@Module({
  controllers: [CodespacesController],
  providers: [CodespacesService],
  imports: [
    UtilsModule,
    StorageModule,
    HackerEarthModule,
    RequestModule.registerAsync(),
    TypeOrmModule.forFeature([Codespaces])
  ]
})
export class CodespacesModule { }
