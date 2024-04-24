import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UsersService } from './service/user.service';
import { OtpService } from 'src/otp/services/otp.service';
import { TokenService } from '@app/my-library/token/service/token.service';
import { SharedEventEmitterService } from '@app/my-library/event/shared-event-emitter.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { Otp } from 'src/otp/model/otp.model';
import { User } from './model/user.model';

@Module({
  controllers: [UserController],
  providers: [
    UsersService,
    OtpService,
    TokenService,
    SharedEventEmitterService,
  ],
  imports: [SequelizeModule.forFeature([User, Otp]), HttpModule],
  exports: [UsersService],
})
export class UserModule {}
