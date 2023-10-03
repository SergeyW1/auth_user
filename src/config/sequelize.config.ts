import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from '../users/users.model';

export default {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  models: [User],
  autoLoadModels: true,
} as SequelizeModuleOptions;
