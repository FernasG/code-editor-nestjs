import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authenticationService: AuthenticationService) {
        super({ usernameField: 'email' });
    }

    public async validate(email: string, password: string) {
        const user = await this.authenticationService.validateUser(email, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}