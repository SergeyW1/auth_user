import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getAllUser(): Promise<User[]> {
    return this.userModel.findAll({
      order: [['id', 'ASC']],
    });
  }

  async getUserByName(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({
      where: { username },
    });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({
      where: { email },
    });
  }

  async createUser(userDto: CreateUserDto) {
    return await this.userModel.create({
      ...userDto,
      avatar_path: userDto.avatar_path || 'null',
      role: userDto.role || 'User',
    });
  }
}
