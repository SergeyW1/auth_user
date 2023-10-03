import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { MyLogger } from '../logger/my-logger';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly myLogger: MyLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    ); // Получение доступа к ролям
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest(); // получаем объект запроса request из контекста
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    try {
      // декодирует JWT-токен и проверяет его подпись,
      // чтобы убедиться в его целостности и подлинности.
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.PRIVATE_KEY,
      });
    } catch {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    const isAuthorized = requiredRoles.some((role: string) =>
      request['user']['role'].includes(role),
    );
    if (isAuthorized) {
      return true;
    }
    this.myLogger.error('Недостаточно прав');
    throw new ForbiddenException('Недостаточно прав');
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
