import { ObjectValidationPipe } from '@app/my-library/pipe/validation.pipe';
import { TokenService } from '@app/my-library/token/service/token.service';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { hashPassword } from '@app/my-library/function/password.function';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/otp/services/otp.service';
import { OtpTypeEnum } from 'src/otp/enums/otp.enum';
import * as mailgun from 'mailgun-js';
import { MovieDto, UpdateMovieDto } from '../dto/movie.dto';
import { MovieService } from '../service/movie.service';
import { MovieUserPipe } from '../pipe/movie.pipe';
import { Comments } from 'src/comment/model/comment.model';

@Controller('movie')
export class movieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('createMovie')
  async postMovie(
    @Body(MovieUserPipe) data: MovieDto,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try {
      const { title, category, rating, duration } = data;
      const movie = await this.movieService.initialize({
        title: title,
        category: category,
        rating: rating,
        duration: duration,
        userId: token.id,
      });

      await movie.save();

      // TODO: send account verification email
      return {
        message: ' Movie created successful.',
        data: { movie },
      };
    } catch (error) {
      console.log('error', error);
      Logger.log('error', error);
      throw new InternalServerErrorException('Smething unexpected happened');
    }
  }

  @Get('getMovies')
  async GetAllMovies(@UserTokenDecorator() token: UserTokenDto) {
    const movie = await this.movieService.findAll({
      where: {
        userId: token.id,
      },
    });
    return {
      data: movie,
    };
  }

  @Get('getMoviesTitle')
  async GetMovieByTitle(
    @UserTokenDecorator() token: UserTokenDto,
    @Query('title') title?: string,
  ) {
    const movie = await this.movieService.findAll({
      where: {
        userId: token.id,
        title: title,
      },
    });
    return {
      data: movie,
    };
  }

  @Get('getMoviesCategory')
  async GetMovieByCategory(
    @UserTokenDecorator() token: UserTokenDto,
    @Query('category') category?: string,
    @Query('ratings') ratings?: string,
  ) {
    let movies;
    if (category) {
      switch (category.toLowerCase()) {
        case 'action':
        case 'comedy':
        case 'drama':
        case 'horror':
        case 'sci-fi':
        case 'thriller':
          movies = await this.movieService.findAll({
            where: {
              userId: token.id,
              category: category,
            },
          });
          break;
        default:
          movies = [];
          break;
      }
    }
    if (ratings) {
      switch (ratings) {
        case 'G':
        case 'PG':
        case 'PG-13':
        case 'R':
        case 'NC-17':
          movies = await this.movieService.findAll({
            where: {
              userId: token.id,
              rating: ratings,
            },
          });
          break;
        default:
          movies = [];
          break;
      }
    }

    return {
      data: movies,
    };
  }

  @Patch('update/:id')
  async updateMovie(
    @Body() data: UpdateMovieDto,
    @Param('id') id: number,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try {
      const updatedMovie = await this.movieService.findByIdAndUpdate(id, {
        title: data.title,
        category: data.category,
        rating: data.rating,
        duration: data.duration,
        userId: token.id,
      });

      if (!updatedMovie) {
        throw new NotFoundException('Movie not found.');
      }

      console.log('Updated Movie:', updatedMovie);

      return {
        message: 'Movie updated successfully.',
        data: updatedMovie,
      };
    } catch (error) {
      console.error('Error updating movie:', error);
      throw new InternalServerErrorException('Something unexpected happened');
    }
  }
  @Get('getMoviesComments')
  async SearchSource1(
    @UserTokenDecorator() token: UserTokenDto,
    @Query('title') title?: string,
  ) {
    const movie = await this.movieService.findOne({
      where: { title },
      include: [
        {
          model: Comments,
          as: 'comments', // This should match the alias in the model definition
          attributes: ['id', 'content'], // Specify the attributes you want to retrieve
        },
      ],
    });
    return {
      data: movie,
    };
  }
}
