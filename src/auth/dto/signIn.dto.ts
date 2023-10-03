import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'Nick@gmail.com', description: 'Почта пользователя' })
  @IsNotEmpty({ message: 'Почта не должна быть пустой' })
  @IsString()
  email: string;

  @ApiProperty({ example: '12345', description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(5, { message: 'Пароль должен содержать не менее 5 символов' })
  password: string;
}
