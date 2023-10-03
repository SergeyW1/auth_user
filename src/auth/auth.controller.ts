import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { TokenInterface } from './interfaces/token.interface';
import { LoggingInterceptor } from '../interceptor/logging.interceptor';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Авторизация')
@Controller({
  path: 'auth',
  version: '2',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(LoggingInterceptor)
  @ApiOperation({ summary: 'Авторизоваться' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: SignInDto): Promise<string | TokenInterface> {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Показать профиль авторизованного пользователя' })
  @Roles(Role.User, Role.Admin)
  @Get('profile')
  async profile(@Request() req): Promise<Request> {
    return req.user;
  }

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar_path', {
      // перехватчик маршрута
      storage: diskStorage({
        destination: './src/uploads',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const format = file.originalname.split('.')[1];
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}.${format}`);
        },
      }),
    }),
  )
  async registration(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        // извлекает файл перехватчика маршрута
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2mb
          // Проверяет, меньше ли размер данного файла предоставленного значения (измеряется в bytes)
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/i }),
          // Проверяет, соответствует ли MIME-тип данного файла заданному значению.
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<TokenInterface> {
    return this.authService.registration({
      ...createUserDto,
      avatar_path: file.path,
    });
  }
}
