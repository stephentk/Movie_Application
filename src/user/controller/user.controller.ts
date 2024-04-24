import { ObjectValidationPipe } from '@app/my-library/pipe/validation.pipe';
import { TokenService } from '@app/my-library/token/service/token.service';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { hashPassword } from '@app/my-library/function/password.function';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';
import { UsersService } from '../service/user.service';
import {
  Confirm2FACodePipe,
  LoginUserPipe,
  RegistrationPipe,
} from '../pipe/registration.pipe';
import {
  UserCodeConfirmDto,
  UserCreateDto,
  UserLoginDto,
  UserloginDataResponse,
} from '../dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/otp/services/otp.service';
import { OtpTypeEnum } from 'src/otp/enums/otp.enum';
import * as mailgun from 'mailgun-js';
import { Favorite } from 'src/favorite/model/favorite.model';
import { Movie } from 'src/movie/model/movie.model';

@Controller('user')
export class UserController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register')
  async register(@Body(RegistrationPipe) data: UserCreateDto) {
    try {
      // TODO: Restrict setting to administrator account only.
      let firstName;
      let lastName;
      const { email, fullName, password, dateOfBirth } = data;

      if (fullName.split(' ').length === 2) {
        firstName = fullName.split(' ')[0];
        lastName = fullName.split(' ')[1];
      } else {
        firstName = fullName.split(' ')[0];
        lastName = fullName.split(' ')[2];
      }

      const user = await this.userService.initialize({
        email: email.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        password: await hashPassword(password),
        dateOfBirth: dateOfBirth,
      });

      await user.save();
      console.log('sjsjsjs', user.email);

      const token = await this.tokenService.tokenize({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
      const mailgun = require('mailgun-js');
      const DOMAIN = 'sandboxc90e7ee225014be6989c294824da2891.mailgun.org';
      const mg = mailgun({
        apiKey: `${this.configService.get('maillgunApiKey')}`,
        domain: DOMAIN,
      });
      const emaildata = {
        from: 'Mailgun Sandbox <postmaster@sandboxc90e7ee225014be6989c294824da2891.mailgun.org>',
        to: user.email,
        subject: `Welcome to Movie Database Application ${user.firstName}`,
        template: 'movie registration',
        'h:X-Mailgun-Variables': {
          User: user.firstName,
        },
      };
      mg.messages().send(emaildata, function (error, body) {
        console.log(body);
      });

      // TODO: send account verification email
      return {
        message: 'Registration successful.',
        data: { id: user.id },
        token,
      };
    } catch (error) {
      console.log('error', error);
      Logger.log('error', error);
      throw new InternalServerErrorException('Smething unexpected happened');
    }
  }
  @Post('login')
  async login(@Body(LoginUserPipe) userLogin: UserLoginDto) {
    const user = await this.userService.findOne({
      where: {
        email: {
          [Op.iLike]: userLogin.email,
        },
      },
    });
    const token = await this.tokenService.tokenize({
      data: {
        id: user.id,
        email: userLogin.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    if (userLogin.registrationToken) {
      await this.userService.findByIdAndUpdate(user.id, {
        registrationToken: userLogin.registrationToken,
      });
    }
    /*  if (user.FactorAuth) {
      user.validFactorAuth = false;
      await user.save();
      const emailData = {
        username: user.firstName + ' ' + user.lastName,
        subject: '2FA Verification Code',
        email: user.email,
        receiver: user.id,
      };
      this.eventEmitter.emitAsync(
        AuthenticationEvent.SEND_2FA_VERIFICATION_CODE_1,
        emailData,
      );
    }
    */
    user.validFactorAuth = false;
    const receiver = user.id;
    const type = OtpTypeEnum.Email;

    await user.save();
    const generatedCode = await this.otpService.generateCode(receiver, type);

    const mailgun = require('mailgun-js');
    const DOMAIN = 'sandboxc90e7ee225014be6989c294824da2891.mailgun.org';
    const mg = mailgun({
      apiKey: `${this.configService.get('maillgunApiKey')}`,
      domain: DOMAIN,
    });
    const data = {
      from: 'Mailgun Sandbox <postmaster@sandboxc90e7ee225014be6989c294824da2891.mailgun.org>',
      to: user.email,
      subject: `VerficationCode To Movie Database Application`,
      template: 'movieotptemplate',
      'h:X-Mailgun-Variables': {
        User: user.firstName,
        VerificationCode: generatedCode.code,
      },
    };

    mg.messages().send(data, function (error, body) {
      console.log(body);
    });
    console.log('code...', generatedCode.code);

    /*   if (user.registrationToken) {
      const pushNotificationData = {
        title: 'ACCOUN LOGIN NOTIFICATION!!!',
        body: `Hi Vesti! Please be informed that your account was accessed on ${this.usersService.dateFormatterWithTime(
          new Date(),
        )}. If not, secure your account now.`,
        token: user.registrationToken,
      };
      this.eventEmitter.emitAsync(
        PushNotificationEvents.SEND_LOGIN_NOTIFICATION,
        pushNotificationData,
      );
    }
    */
    const response: UserloginDataResponse = {
      id: user.id,
      email: user.email,
      factorAuth: user.FactorAuth,
      profilePictureURL: user.profilePictureURL,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return {
      message: 'Successfully logged in',
      user: response,
      token,
    };
  }

  @Post('confirm-2fa')
  @UseGuards()
  async confirm2FA(
    @Body(Confirm2FACodePipe)
    userCode: UserCodeConfirmDto,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    try {
      const user = await this.userService.findByIdAndUpdate(token.id, {
        validFactorAuth: true,
      });
      console.log('ab', token.email);

      /* const user = await this.usersService.findOne({
      where: { id:userCode.id },
    });

    */
      //console.log('ioio',token.id)
      return {
        message: 'OTP confirmed successfully',
      };
    } catch {
      return {
        message:
          'Failed to confirm OTP. Please verify your code and try again.',
      };
    }
  }
  @Get('userFavorites')
  async userFavorite(@UserTokenDecorator() token: UserTokenDto) {
    const user = await this.userService.findOne({
      where: { id: token.id },
      include: [
        {
          model: Favorite,
          as: 'favorite',
          include: [
            {
              model: Movie,
              as: 'movie',
              attributes: ['id', 'title', 'category', 'rating', 'duration'],
            },
          ],
          attributes: ['movieId', 'isFavorite'],
        },
      ],
    });

    const movies = user.favorite.map((fav) => {
      return {
        id: fav.movie.id,
        title: fav.movie.title,
        category: fav.movie.category,
        rating: fav.movie.rating,
        duration: fav.movie.duration,
        isFavorite: fav.isFavorite,
      };
    });

    return {
      data: movies,
    };
  }
}
