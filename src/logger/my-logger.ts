import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  error(message: any, ...optionalParams): any {
    console.error(
      `[${this.getTimestamp()}] [ОШИБКА]: ${message}`,
      ...optionalParams,
    );
  }

  warn(message: any, ...optionalParams): any {
    console.warn(
      `[${this.getTimestamp()}] [ПРЕДУПРЕЖДЕНИЕ]: ${message}`,
      ...optionalParams,
    );
  }

  log(message: any, ...optionalParams): any {
    console.log(
      `[${this.getTimestamp()}] [ЛОГ]: ${message}`,
      ...optionalParams,
    );
  }

  private getTimestamp(): string {
    return new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
}
