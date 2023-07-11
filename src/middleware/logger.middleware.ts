import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl, body, params, query } = req;
    const path = baseUrl.replace('/', '');
    const now = new Date().toLocaleString('pt-br');
    const data = { ...params ?? query };

    console.log(`[${method}] ${path} - ${now}`);

    next();
  } 

}