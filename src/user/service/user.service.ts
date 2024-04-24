import { ModelCtor } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '@app/my-library/db/db.service';
import { Op } from 'sequelize';
import { User } from '../model/user.model';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User)
    private readonly userModel: ModelCtor<User>,
  ) {
    super(userModel);
  }

  initialize = (data: any) => {
    return new User(data);
  };
}
