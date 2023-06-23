import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodespacesService } from './codespaces.service';
import { CodespacesController } from './codespaces.controller';
import { RequestModule, UtilsModule } from '@libraries';
import { Codespaces, HackerearthRequests } from '@database';

@Module({
  controllers: [CodespacesController],
  providers: [CodespacesService],
  imports: [UtilsModule, RequestModule, TypeOrmModule.forFeature([Codespaces, HackerearthRequests])]
})
export class CodespacesModule { }
