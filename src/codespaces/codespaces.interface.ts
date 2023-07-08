import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

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

export interface HackerEarthResponse {
  context: string;
  result: { run_status: { status: string; }; compile_status: string };
  he_id: string;
  status_update_url: string;
  request_status: { code: string; message: string; }
}

export enum HackerEarthRequestCodes {
  QUEUED = 'REQUEST_QUEUED',
  COMPILED = 'CODE_COMPILED',
  COMPLETED = 'REQUEST_COMPLETED'
}