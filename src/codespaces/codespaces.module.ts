import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodespacesService } from './codespaces.service';
import { CodespacesController } from './codespaces.controller';
import { HackerEarthModule, RequestModule, UtilsModule } from '@libraries';
import { Codespaces } from '@database';

@Module({
  controllers: [CodespacesController],
  providers: [CodespacesService],
  imports: [UtilsModule, RequestModule.registerAsync(), HackerEarthModule, TypeOrmModule.forFeature([Codespaces])]
})
export class CodespacesModule { }
