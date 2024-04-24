import { Module } from '@nestjs/common';
import { favoriteController } from './controller/favorite.controller';
import { Favorite } from './model/favorite.model';
import { FavoriteService } from './service/favorite.service';
import { SharedEventEmitterService } from '@app/my-library/event/shared-event-emitter.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [favoriteController],
  providers: [FavoriteService, SharedEventEmitterService],
  imports: [SequelizeModule.forFeature([Favorite]), HttpModule],
  exports: [FavoriteService],
})
export class favoriteModule {}
