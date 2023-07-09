import { DynamicModule, Module } from '@nestjs/common';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';
import { S3_ASYNC_OPTIONS } from './s3.interface';

@Module({
    providers: [S3Service],
    exports: [S3Service]
})
export class S3Module {
    static forRoot(options: S3ClientConfig): DynamicModule {
        return {
          module: S3Module,
          providers: [
            {
              provide: S3Service,
              useClass: S3Service,
              useValue: options
            }
          ],
          exports: [S3Service]
        }
      }
    
      static forRootAsync(options: any): DynamicModule {
        return {
          module: S3Module,
          providers: [
            {
              ...options,
              provide: S3_ASYNC_OPTIONS
            },
            {
              provide: S3Service,
              useFactory: ((options: S3ClientConfig) => { return new S3Service(options); }),
              inject: [S3_ASYNC_OPTIONS]
            }
          ],
          exports: [S3Service]
        }
      }
}