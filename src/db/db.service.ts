// db.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

import { Otp } from 'src/otp/model/otp.model';
import { AppConfigs } from 'src/app-config/model/app-config.model';
import { User } from 'src/user/model/user.model';
import { Movie } from 'src/movie/model/movie.model';
import { Comments } from 'src/comment/model/comment.model';
import { Likes } from 'src/like-dislike-movie/model/like-dislike-model';
import { Favorite } from 'src/favorite/model/favorite.model';

@Injectable()
export class DbService implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'postgres',
      host: this.configService.get('POSTGRES_DB_HOST'),
      port: this.configService.get<number>('POSTGRES_DB_PORT'),
      username: this.configService.get('POSTGRES_DB_USER'),
      password: this.configService.get('POSTGRES_DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      dialectOptions: {
        ssl: {
          require: true, // This ensures SSL is enabled
          rejectUnauthorized: false, // This allows self-signed certificates
        },
      },
      models: [Otp, AppConfigs, User, Movie, Comments, Likes, Favorite],
    };
  }
}
