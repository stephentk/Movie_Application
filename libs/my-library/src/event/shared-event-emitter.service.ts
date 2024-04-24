import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SharedEventEmitterService {
  public readonly eventEmitter = new EventEmitter2();
}
