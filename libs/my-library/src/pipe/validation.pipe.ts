import {
  Injectable,
  NotFoundException,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { ArraySchema, ObjectSchema, StringSchema } from 'joi';

@Injectable()
export class ObjectValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}
  async transform(data: any): Promise<void> {
    try {
      if (!data) throw new NotFoundException('input data not specified');
      const value = await this.schema
        .unknown(false)
        .validateAsync(data, { stripUnknown: true });
      return value;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}

@Injectable()
export class ArrayValidationPipe implements PipeTransform {
  constructor(private readonly schema: ArraySchema) {}
  async transform(data: any[]): Promise<void> {
    try {
      if (!data || data.length === 0)
        throw new NotFoundException('input data not specified');

      const value = await this.schema.validateAsync(data, {
        stripUnknown: true,
        convert: false,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return value;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}

@Injectable()
export class StringValidationPipe implements PipeTransform {
  constructor(private readonly schema: StringSchema) {}
  async transform(data: any): Promise<void> {
    try {
      if (!data) throw new NotFoundException('input data not specified');

      const value = await this.schema.validateAsync(data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return value;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
