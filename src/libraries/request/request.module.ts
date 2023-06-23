import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { RequestService } from "./request.service";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [HttpModule.registerAsync({
        inject: [ConfigService],
        useFactory: ((configService) => ({
            baseURL: 'https://api.hackerearth.com/v4',
            headers: { 'client-secret': configService.get('hackerearth_api_key') }
        }))
    })],
    providers: [RequestService],
    exports: [RequestService]
})
export class RequestModule { }