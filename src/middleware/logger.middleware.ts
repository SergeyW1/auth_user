import { Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLogger } from '../logger/my-logger';

export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(MyLogger) private readonly myLogger: MyLogger) {}

  use(req: Request, res: Response, next) {
    this.myLogger.log(`Request...`);
    this.myLogger.log(`Method: ${req.method}`);
    this.myLogger.log(`Path: ${req.path}`);
    this.myLogger.log(`Body: ${JSON.stringify(req.body)}`);
    next();
    this.myLogger.log(`Response...`);
    this.myLogger.log(`Status: ${res.statusCode}`);
    this.myLogger.log(`Body: ${JSON.stringify(req.body)}`);
    this.myLogger.log(`End.`);
  }
}
