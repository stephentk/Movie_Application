import { Module } from '@nestjs/common';
import { SharedEventEmitterService } from '@app/my-library/event/shared-event-emitter.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { movieController } from './controller/movie.controller';
import { MovieService } from './service/movie.service';
import { Movie } from './model/movie.model';

@Module({
  controllers: [movieController],
  providers: [MovieService, SharedEventEmitterService],
  imports: [SequelizeModule.forFeature([Movie]), HttpModule],
  exports: [MovieService],
})
export class movieModule {}
