import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from './logger/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { LoggerMiddleware } from './middleware/logger.middleware';
import SequelizeConfig from './config/sequelize.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot(SequelizeConfig),
    CacheModule.register({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, // разрешения внедрения зависимостей вне контекста любого модуля
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //
    consumer
      .apply(LoggerMiddleware) // какие middleware будут использоваться
      // .exclude(
      //     {path: 'cats', method: RequestMethod.PUT}
      // ) когда мы хотим исключить определенные маршруты
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
    // какие пути и методы будут проходить через middleware
  }
}
