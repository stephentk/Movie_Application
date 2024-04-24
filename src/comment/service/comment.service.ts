import { ModelCtor, Repository } from 'sequelize-typescript';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '@app/my-library/db/db.service';
import { Op, where } from 'sequelize';
import { Comments } from '../model/comment.model';

@Injectable()
export class CommentService extends BaseService<Comments> {
  constructor(
    @InjectModel(Comments)
    private readonly commentModel: ModelCtor<Comments>,
  ) {
    super(commentModel);
  }

  initialize = (data: any) => {
    return new Comments(data);
  };
}
