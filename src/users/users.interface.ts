import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(10)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6)
    password: string;
}

export const ENCRYPT_SALT_ROUNDS = 10;