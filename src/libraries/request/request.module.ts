import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule, HttpModuleAsyncOptions } from '@nestjs/axios';
import { RequestService } from './request.service';

@Module({
  imports: [HttpModule],
  providers: [RequestService],
  exports: [RequestService]
})
export class RequestModule {
  static async registerAsync(options: HttpModuleAsyncOptions): Promise<DynamicModule> {
    return {
      module: RequestModule,
      providers: [RequestService],
      imports: [HttpModule.registerAsync(options)],
      exports: [RequestService]
    }
  }
}