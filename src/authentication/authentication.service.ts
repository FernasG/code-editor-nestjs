import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";
import { User } from "@database";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthenticationService {
    constructor(private readonly jwtService: JwtService, private readonly datasource: DataSource) { }

    public async validateUser(email: string, password: string) {
        const user = await this.datasource.getRepository(User).findOne({ where: { email } });

        if (!user) return null;

        if (!bcrypt.compareSync(password, user.password)) return null;

        const { password: pass, ...result } = user;

        return result;
    }

    public async login(user: Partial<User>) {
        const payload = { id: user.id, email: user.email };
        return { ...user, session_token: this.jwtService.sign(payload) };
    }
}