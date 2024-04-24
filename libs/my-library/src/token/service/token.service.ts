import { BaseEnvConfig } from '@app/my-library/env/enum/env.enum';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { RefreshTokenDto, UserTokenDto } from '../dto/token.dto';
import { error } from 'console';

@Injectable()
export class TokenService {
  private expiresIn: string;
  private tokenSecret: string;
  private refreshTokenExpiration: string;
  constructor(private config: ConfigService) {
    this.expiresIn = this.config.get(BaseEnvConfig.TOKEN_EXPIRATION_TIME);
    this.tokenSecret = this.config.get(BaseEnvConfig.TOKEN_SECRET);
    this.refreshTokenExpiration = config.get(
      BaseEnvConfig.REFRESH_TOKEN_EXPIRATION_TIME,
    );
  }

  generateToken<
    T extends {
      expiresIn: '30m' | '15m' | '1d' | '1y';
      secret: string;
    },
  >({ secret, expiresIn, ...data }: T): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(data, secret, { expiresIn }, (err, decoded) => {
        if (err) {
          reject(new BadRequestException(err));
        }
        resolve(decoded);
      });
    });
  }
  validateToken<T>(
    token: string,
    secret: string,
    ignoreExpiration = false,
  ): Promise<T> {
    return new Promise((resolve) => {
      jwt.verify(token, secret, { ignoreExpiration }, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError' && ignoreExpiration === false) {
            throw new HttpException(
              {
                status: 451,
                message: 'token expired',
              },
              451,
            );
          } else {
            resolve(decoded as T);
          }
          throw new BadRequestException(err.message);
        }
        resolve(decoded as T);
      });
    });
  }

  tokenize({
    data,
    expiresIn = this.expiresIn,
  }: {
    data: UserTokenDto;
    expiresIn?: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('**********', expiresIn, data);
      jwt.sign(data, this.tokenSecret, { expiresIn }, (err, decoded) => {
        if (err) {
          console.log('errorr...', err);
          reject(new HttpException(err, 451));
        }
        resolve(decoded);
      });
    });
  }

  verifyExpiredToken(token: string): Promise<UserTokenDto> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get(BaseEnvConfig.TOKEN_SECRET);
      jwt.verify(
        token,
        tokenSecret,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) reject(new HttpException(err, 451));
          resolve(decoded as UserTokenDto);
        },
      );
    });
  }

  refreshToken({
    id,
    expiresIn = this.refreshTokenExpiration,
  }: {
    id: string;
    expiresIn?: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get(BaseEnvConfig.REFRESH_TOKEN_SECRET);
      jwt.sign({ id }, tokenSecret, { expiresIn }, (err, decoded) => {
        if (err) reject(new HttpException(err, 451));
        resolve(decoded);
      });
    });
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenDto> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get(BaseEnvConfig.REFRESH_TOKEN_SECRET);
      jwt.verify(token, tokenSecret, (err, decoded) => {
        if (err) reject(new HttpException(err, 451));
        resolve(decoded as RefreshTokenDto);
      });
    });
  }

  verifyUserToken(token: string): Promise<UserTokenDto> {
    return new Promise((resolve) => {
      jwt.verify(token, this.tokenSecret, (err, decoded: UserTokenDto) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            throw new HttpException(
              {
                status: 451,
                message: 'token expired',
              },
              451,
            );
          }
          throw new BadRequestException(err.message);
        }
        resolve(decoded);
      });
    });
  }

  decode(token: string) {
    return jwt.decode(token, { complete: true });
  }
}
