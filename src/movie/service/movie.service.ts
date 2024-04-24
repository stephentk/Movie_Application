import { ModelCtor, Repository } from 'sequelize-typescript';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseService } from '@app/my-library/db/db.service';
import { Op, where } from 'sequelize';
import { Movie } from '../model/movie.model';
import { UpdateMovieDto } from '../dto/movie.dto';

@Injectable()
export class MovieService extends BaseService<Movie> {
  constructor(
    @InjectModel(Movie)
    private readonly movieModel: ModelCtor<Movie>,
  ) {
    super(movieModel);
  }

  initialize = (data: any) => {
    return new Movie(data);
  };
}
