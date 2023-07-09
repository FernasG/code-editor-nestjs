import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HackerEarthService } from './hackerearth.service';
import { RequestModule } from '@libraries';

@Module({
  providers: [HackerEarthService],
  exports: [HackerEarthService],
  imports: [
    RequestModule.registerAsync({
      inject: [ConfigService],
      useFactory: ((configService: ConfigService) => ({
        baseURL: 'https://api.hackerearth.com/v4',
        headers: { 'client-secret': configService.get('hackerearth_api_key') }
      }))
    })
  ]
})
export class HackerEarthModule { }