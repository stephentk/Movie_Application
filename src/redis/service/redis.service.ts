import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getData(key: string) {
    const data = await this.cacheService.get(key);
    if (!data) {
      throw new NotFoundException('Data not found');
    }
    return data;
  }

  async setData<T>(key: string, data: T) {
    await this.cacheService.set(key, data);
  }

  async deleteData(key: string) {
    await this.cacheService.del(key);
  }
}
