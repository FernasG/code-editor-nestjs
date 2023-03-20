import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthenticationService } from "./authentication.service";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: ((configService: ConfigService) => configService.get('jwt_options'))
        })
    ],
    providers: [AuthenticationService],
    exports: [AuthenticationService]
})
export class AuthenticationModule { }