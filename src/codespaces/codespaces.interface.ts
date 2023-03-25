import { IsIn, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCodespaceDto {
    @IsString()
    @Length(5)
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsString()
    @IsIn(['javascript', 'python'])
    @IsNotEmpty()
    language: string;
}

export class UpdateCodespaceDto {
    @IsString()
    @Length(5)
    @IsNotEmpty()
    name?: string;

    @IsString()
    description?: string;
}

export interface User {
    id: string;
    email: string;
}