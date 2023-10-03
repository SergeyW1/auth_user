import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MyLogger } from '../logger/my-logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private myLogger: MyLogger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    this.myLogger.log('Before...');
    const now = Date.now();
    return next
      .handle() // возвращает observable
      .pipe(tap(() => this.myLogger.log(`After... ${Date.now() - now}ms`)));
  }
}
