import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';
import { LikesService } from '../service/like-dislike.service';
import { dislikeDto, likeDto } from '../dto/like-dislike.dto';

@Controller('Likes')
export class likesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('likeMovie')
  async like(@Body() data: likeDto, @UserTokenDecorator() token: UserTokenDto) {
    try {
      const { userId, movieId, isLiked } = data;

      const LikeMovie = await this.likesService.initialize({
        isLiked: isLiked,
        movieId: movieId,
        userId: token.id,
      });

      await LikeMovie.save();

      return {
        message: ' comment created successful.',
        data: { LikeMovie },
      };
    } catch (error) {
      console.log('error', error);
      Logger.log('error', error);
      throw new InternalServerErrorException('Smething unexpected happened');
    }
  }

  @Patch('dislike/:id')
  async updateMovie(
    @Body() data: dislikeDto,
    @Param('id') id: number,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try {
      const updatedLiked = await this.likesService.findByIdAndUpdate(id, {
        isLiked: data.isLiked,
        userId: token.id,
      });

      if (!updatedLiked) {
        throw new NotFoundException('Movie not found.');
      }

      return {
        message: 'Movie updated successfully.',
        data: updatedLiked,
      };
    } catch (error) {
      console.error('Error updating movie:', error);
      throw new InternalServerErrorException('Something unexpected happened');
    }
  }
}
