import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';
import { Strategy } from 'passport-local';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly i18n: I18nService

    ) {
        super({ usernameField: 'email' });
    }

    public async validate(email: string, password: string) {
        const user = await this.authenticationService.validateUser(email, password);

        if (!user) {
            const message = this.i18n.t('users.login_failed');
            throw new UnauthorizedException(message);
        }

        return user;
    }
}