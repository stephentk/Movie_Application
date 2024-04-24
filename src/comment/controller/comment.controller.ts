import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { CommentService } from '../service/comment.service';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';
import { commentDto } from '../dto/comment.dto';

@Controller('comment')
export class commentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('createComment')
  async comment(
    @Body() data: commentDto,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try {
      const { content, movieId } = data;

      const comment = await this.commentService.initialize({
        content: content,
        movieId: movieId,
        userId: token.id,
      });

      await comment.save();

      return {
        message: ' comment created successful.',
        data: { comment },
      };
    } catch (error) {
      console.log('error', error);
      Logger.log('error', error);
      throw new InternalServerErrorException('Smething unexpected happened');
    }
  }
}
