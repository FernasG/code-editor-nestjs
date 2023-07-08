import { IsIn, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

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

export class SaveCodespaceDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export interface User {
  id: string;
  email: string;
}

export interface HackerEarthResponse {
  context: string;
  result: { run_status: { status: string; output?: string; }; compile_status: string };
  he_id: string;
  status_update_url: string;
  request_status: { code: string; message: string; }
}

export enum HackerEarthRequestCodes {
  QUEUED = 'REQUEST_QUEUED',
  COMPILED = 'CODE_COMPILED',
  COMPLETED = 'REQUEST_COMPLETED'
}

export const HACKEREARTH_TIMEOUT: Readonly<number> = 1.5 * 1000; 