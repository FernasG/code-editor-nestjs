import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service extends S3Client {
  public async putObject(input: PutObjectCommandInput): Promise<PutObjectCommandOutput> {
    return this.send(new PutObjectCommand(input)).catch(err => err);
  }

  public async getObject(input: GetObjectCommandInput): Promise<GetObjectCommandOutput> {
    return this.send(new GetObjectCommand(input)).catch(err => err);
  }

  public async deleteObject(input: DeleteObjectCommandInput): Promise<DeleteObjectCommandOutput> {
    return this.send(new DeleteObjectCommand(input)).catch(err => err);
  }
}