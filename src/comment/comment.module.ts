import { Module } from '@nestjs/common';
import { SharedEventEmitterService } from '@app/my-library/event/shared-event-emitter.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { commentController } from './controller/comment.controller';
import { CommentService } from './service/comment.service';
import { Comments } from './model/comment.model';

@Module({
  controllers: [commentController],
  providers: [CommentService, SharedEventEmitterService],
  imports: [SequelizeModule.forFeature([Comments]), HttpModule],
  exports: [CommentService],
})
export class commentModule {}
