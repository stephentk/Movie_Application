import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/service/token.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserTokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization)
      throw new UnauthorizedException('please provide valid login token');

    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader.split(' ');

    if (token === 'null' || token === null)
      throw new BadRequestException('session expired');
    if (bearer !== 'Bearer') {
      throw new BadRequestException('please provide valid login token');
    }

    if (!token) {
      throw new BadRequestException('please provide valid login token');
    }
    const tokenData = await this.tokenService.verifyUserToken(token);
    res.locals.tokenData = tokenData;
    next();
  }
}

@Injectable()
export class GoogleTokenGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }
}
