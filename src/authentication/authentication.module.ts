import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthenticationService } from "./authentication.service";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";

@Global()
@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: ((configService: ConfigService) => configService.get('jwt_options'))
        })
    ],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy],
    exports: [AuthenticationService]
})
export class AuthenticationModule { }