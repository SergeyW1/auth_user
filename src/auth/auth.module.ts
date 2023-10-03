import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from '../logger/logger.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    LoggerModule,
    JwtModule.register({
      global: true,
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MulterModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
