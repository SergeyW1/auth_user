import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Nick', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  username: string;

  @ApiProperty({ example: '12345', description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(5, { message: 'Пароль должен содержать не менее 5 символов' })
  password: string;

  @ApiProperty({ example: 'Nick@gmail.com', description: 'Почта пользователя' })
  @IsEmail(
    {},
    { message: 'Почта должна быть действительным адресом электронной почты' },
  )
  @IsNotEmpty({ message: 'Почта не должна быть пустой' })
  email: string;

  @ApiProperty({ example: 'Admin', description: 'Роль пользователя' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({
    type: 'file',
    format: 'binary',
    description: 'Фотография пользователя',
  })
  @IsOptional()
  avatar_path?: string;
}
