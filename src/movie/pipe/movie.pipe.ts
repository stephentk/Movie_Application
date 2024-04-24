import { ConflictException, Injectable, PipeTransform } from '@nestjs/common';
import { MovieService } from '../service/movie.service';
import { Op } from 'sequelize';
import { MovieDto } from '../dto/movie.dto';

@Injectable()
export class MovieUserPipe implements PipeTransform {
  constructor(private readonly movieservice: MovieService) {}

  async transform(movie: MovieDto) {
    const { title } = movie;
    const movies = await this.movieservice.findOne({
      where: {
        title: {
          [Op.iLike]: title,
        },
      },
    });
    if (movies) {
      throw new ConflictException('MOVIE ALREADY EXISTS');
    }

    return movie;
  }
}
