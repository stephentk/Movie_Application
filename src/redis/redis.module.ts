import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './service/redis.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
