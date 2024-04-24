import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { FavoriteService } from '../service/favorite.service';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { commentDto } from 'src/comment/dto/comment.dto';
import { favoriteDto } from '../dto/favorite.dto';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';

@Controller('favorite')
export class favoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('addFavorite')
  async favorite(
    @Body() data: favoriteDto,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try {
      const { movieId, isFavorite } = data;

      const favorite = await this.favoriteService.initialize({
        isFavorite: isFavorite,
        movieId: movieId,
        userId: token.id,
      });

      await favorite.save();

      return {
        message: ' comment created successful.',
        data: { favorite },
      };
    } catch (error) {
      console.log('error', error);
      Logger.log('error', error);
      throw new InternalServerErrorException('Smething unexpected happened');
    }
  }

  @Delete('deleteFavorite/:id')
  async deleteFavorite(@Param('id') id: number) {
    try {
      const deletedFavorite = await this.favoriteService.delete(id);

      if (!deletedFavorite) {
        throw new NotFoundException('Favorite not found.');
      }

      return {
        message: 'Favorite deleted successfully.',
        data: deletedFavorite,
      };
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException('Something unexpected happened');
    }
  }
}
