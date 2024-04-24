import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AppConfigService } from '../service/app-config.service';
import { AppConfigDto, AppConfigSearchDto } from '../dto/app-config.dto';
import { ObjectValidationPipe } from '@app/my-library/pipe/validation.pipe';
import {
  appConfigCreateValidator,
  appConfigSearchValidator,
} from '../validator/app-config.validator';
import { UserTokenDecorator } from '@app/my-library/token/decorator/token.decorator';
import { UserTokenDto } from '@app/my-library/token/dto/token.dto';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Post('create')
  @UseGuards()
  async createReview(
    @Body(new ObjectValidationPipe(appConfigCreateValidator))
    data: AppConfigDto,
    @UserTokenDecorator() token: UserTokenDto,
  ) {
    // TODO: Restrict setting to administrator account only.
    const config = await this.appConfigService.initialize({
      ...data,
    });
    await config.save();
    // TODO: send account verification email
    return { message: 'Config created successfully', config };
  }

  @Get('list')
  @UseGuards()
  async Search(
    @Query(new ObjectValidationPipe(appConfigSearchValidator))
    query: AppConfigSearchDto,
  ) {
    const paginationResult = await this.appConfigService.search(query);

    return {
      data: paginationResult,
    };
  }
}
