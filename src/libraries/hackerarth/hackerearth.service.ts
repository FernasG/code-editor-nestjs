import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestService } from '../request/request.service';
import { TIME_LIMIT } from './hackerearth.interface';

@Injectable()
export class HackerEarthService {
  private readonly callbackURL: string;

  constructor(private readonly requestService: RequestService, private readonly configService: ConfigService) {
    this.callbackURL = this.configService.get<string>('hackerearth_callback_url');
  }

  public async run(requestId: string, language: string, source: string) {
    const url = 'partner/code-evaluation/submissions/';
    const lang = language.toUpperCase();

    return this.requestService.post(url, { lang, source, time_limit: TIME_LIMIT, context: requestId, callback: this.callbackURL });
  }

}