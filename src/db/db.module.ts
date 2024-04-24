// db.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbService } from './db.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: DbService,
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
