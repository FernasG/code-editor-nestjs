import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3/s3.service';

@Injectable()
export class StorageService {
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService, private readonly s3Service: S3Service) {
    this.bucketName = this.configService.get<string>('s3_bucket');
  }

  public async upload(key: string, body: string) {
    return this.s3Service.putObject({ Bucket: this.bucketName, Key: key, Body: body }).catch(err => err);
  }

  public async get(key: string): Promise<string | null> {
    const s3Response = await this.s3Service.getObject({ Bucket: this.bucketName, Key: key }).catch(err => null);

    if (!s3Response) return null;

    return s3Response.Body.transformToString();
  }
}