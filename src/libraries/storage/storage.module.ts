import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { S3Module } from './s3/s3.module';

@Module({
  providers: [StorageService],
  exports: [StorageService],
  imports: [
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: ((configService: ConfigService) => configService.get('aws'))
    })
  ]
})
export class StorageModule { }