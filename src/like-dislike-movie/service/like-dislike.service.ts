import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '@app/my-library/db/db.service';
import { Op, where } from 'sequelize';
import { Likes } from '../model/like-dislike-model';
import { ModelCtor } from 'sequelize-typescript';

@Injectable()
export class LikesService extends BaseService<Likes> {
  constructor(
    @InjectModel(Likes)
    private readonly likesModel: ModelCtor<Likes>,
  ) {
    super(likesModel);
  }

  initialize = (data: any) => {
    return new Likes(data);
  };
}
