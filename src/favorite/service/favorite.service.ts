import { BaseService } from '@app/my-library/db/db.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Favorite } from '../model/favorite.model';
import { ModelCtor } from 'sequelize-typescript';

@Injectable()
export class FavoriteService extends BaseService<Favorite> {
  constructor(
    @InjectModel(Favorite)
    private readonly FavoriteModel: ModelCtor<Favorite>,
  ) {
    super(FavoriteModel);
  }

  initialize = (data: any) => {
    return new Favorite(data);
  };
}
