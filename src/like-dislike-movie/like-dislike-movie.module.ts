import { Module } from '@nestjs/common';
import { SharedEventEmitterService } from '@app/my-library/event/shared-event-emitter.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { likesController } from './controller/like-dislike.controller';
import { LikesService } from './service/like-dislike.service';
import { Likes } from './model/like-dislike-model';

@Module({
  controllers: [likesController],
  providers: [LikesService, SharedEventEmitterService],
  imports: [SequelizeModule.forFeature([Likes]), HttpModule],
  exports: [LikesService],
})
export class likeModule {}
