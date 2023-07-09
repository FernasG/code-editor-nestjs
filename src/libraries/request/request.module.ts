import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule, HttpModuleAsyncOptions } from '@nestjs/axios';
import { RequestService } from './request.service';

@Module({
  providers: [RequestService],
  exports: [RequestService]
})
export class RequestModule {
  static registerAsync(options?: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: RequestModule,
      providers: [RequestService],
      imports: [options ? HttpModule.registerAsync(options) : HttpModule.register({})],
      exports: [RequestService]
    }
  }
}