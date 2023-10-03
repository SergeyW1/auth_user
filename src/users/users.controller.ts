import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import axios from 'axios';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('Пользователи')
@Controller({
  path: 'users',
  version: '1',
})
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Version('3')
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: HttpStatus.OK })
  @Roles(Role.Admin)
  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.getAllUser();
  }

  @ApiOperation({ summary: 'Получить одного пользователя' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('/:username')
  async getName(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByName(username);
  }

  @Version('3')
  @ApiOperation({ summary: 'Получить html' })
  @Get('/html')
  async getHtml(): Promise<any> {
    const response = await axios.get(`http://localhost:3001/docs/admin/`);
    return response.data;
  }

  @Version('3')
  @Get(':email/photo')
  async getUserPhoto(@Param('email') email: string, @Res() res: Response) {
    try {
      const userData = await this.usersService.getUserByEmail(email);
      if (!userData.avatar_path) {
        return res.status(404).send('User does not have a photo.');
      }
      const avatarPath = path.join(__dirname, '..', '..', userData.avatar_path);
      res.setHeader('Content-Type', 'image/png');
      fs.createReadStream(avatarPath).pipe(res);
    } catch (error) {
      console.error('Error fetching user photo:', error);
      res.status(500).send('Error fetching user photo');
    }
  }
}
