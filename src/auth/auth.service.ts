import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { TokenInterface } from './interfaces/token.interface';
import { MyLogger } from '../logger/my-logger';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private readonly myLogger: MyLogger,
  ) {}

  /**
   *
   * @param email
   * @param password
   */
  async login(
    email: string,
    password: string,
  ): Promise<string | TokenInterface> {
    const cache = `email: ${email}, password: ${password}`;
    const cachedData: string = await this.cacheManager.get(cache);
    if (!cachedData) {
      const user = await this.validateUser(email, password);
      const token = await this.generateToken(user);
      await this.cacheManager.set(cache, token, { ttl: 120 });
      return token;
    }
    this.myLogger.log(`${cache}`, cachedData);
    return cachedData;
  }

  async registration(userDto: CreateUserDto): Promise<TokenInterface> {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate) {
      this.myLogger.error('Пользователь с таким email уже существует');
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User): Promise<TokenInterface> {
    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
      avatar_path: user.avatar_path,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);
    if (user) {
      const passwordEquals = await bcrypt.compare(password, user.password);
      if (passwordEquals) {
        return user;
      }
    }
    this.myLogger.error('Некорректное имя или пароль');
    throw new UnauthorizedException('Некорректное имя или пароль');
  }
}
