import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/service/logger.service';
import { ConfigService } from '@nestjs/config';
import { LoggerInterceptor } from './logger/interceptor/logger.interceptor';
import { ConfigEnum } from './env/enum/env.enum';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: console,
  });
  const allowedOrigins = [
    'http://localhost:3000',
    // Add more frontend URLs as needed
  ];
  app.enableCors({
    origin: allowedOrigins,
  });
  // app.use(csurf());
  const config = app.get(ConfigService);
  const port = config.get(ConfigEnum.PORT);
  const reflector = app.get(Reflector);

  app.useLogger(new CustomLogger(config));
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.use(helmet());
  app.enableCors();

  // set version one to the global prefix
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.debug(`LISTENING ON PORT ${port}`);
}
bootstrap();
