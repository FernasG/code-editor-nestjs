import { Module } from '@nestjs/common';
import { CodespacesService } from './codespaces.service';
import { CodespacesController } from './codespaces.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '@libraries';
import { Codespaces } from '@database';

@Module({
  controllers: [CodespacesController],
  providers: [CodespacesService],
  imports: [UtilsModule, TypeOrmModule.forFeature([Codespaces])]
})
export class CodespacesModule { }
