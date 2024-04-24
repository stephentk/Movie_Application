import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FindOptions,
  UpdateOptions,
  Transaction,
  Op,
  Sequelize,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import shortid from 'shortid';
import { PaginationOptionsDto } from '../dto/pagination.dto';
import { CountryEnum } from '../enum/country.enum';
import * as crypto from 'crypto-js';
import moment from 'moment';
import { customAlphabet } from 'nanoid';

@Injectable()
export class BaseService<T extends Model> {
  constructor(private readonly model: ModelCtor<T>) {}

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findByPk(id);
    if (!result) {
      throw new NotFoundException(`${this.model.name} record not found`);
    }
    return result;
  }

  async findAll(
    data: FindOptions = {},
    include?: any,
    sort?: { [key: string]: 'ASC' | 'DESC' },
  ) {
    const options: FindOptions = {
      where: data.where || {},
      include: include || [],
      order: sort
        ? Object.entries(sort).map(([key, value]) => [key, value])
        : [['createdAt', 'DESC']],
    };

    return this.model.findAll(options);
  }

  async update(id: any, data: Partial<T>): Promise<[number, T[]]> {
    const [affectedCount, updatedRows] = await this.model.update(data, {
      where: { id: id },
      returning: true,
    });
    return [affectedCount, updatedRows];
  }

  async delete(id: any): Promise<number> {
    return this.model.destroy({ where: { id: id } });
  }

  async findOneAndDestroyOrErrorOut(id: any) {
    const result = await this.model.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException(`${this.model.name} record not found`);
    }
    return this.model.destroy({ where: { id: id } });
  }

  async findOneOrErrorOut(options: FindOptions) {
    const result = await this.model.findOne(options);
    if (!result) {
      throw new NotFoundException(`${this.model.name} record not found`);
    }
    return result;
  }

  async findOne(options: FindOptions) {
    options.attributes = { ...options.attributes, exclude: ['password'] };
    return await this.model.findOne(options);
  }

  async count(options: FindOptions) {
    options.attributes = { ...options.attributes };
    return await this.model.count(options);
  }

  async noDuplicate(options: FindOptions) {
    const data = await this.model.findOne(options);
    if (data) {
      throw new BadRequestException(`${this.model.name} already exists`);
    }
  }

  async increment(filter, updateUserDto) {
    return await this.model.increment(updateUserDto, filter);
  }

  async propExists(options: FindOptions) {
    return await this.model.count(options);
  }

  async sum(key, filter) {
    return this.model.sum(key, filter);
  }

  async toSentenceCase(str) {
    const firstChar = str.charAt(0).toUpperCase();
    const restOfString = str.slice(1);
    return firstChar + restOfString;
  }

  async findByIdAndUpdate<T extends Model>(
    id: any,
    data: any,
  ): Promise<number> {
    try {
      const result = await this.model.findByPk(id);
      if (!result) {
        throw new NotFoundException(`${this.model.name} record not found`);
      }
      const [affectedCount] = await this.model.update(data, { where: { id } });

      return affectedCount;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOneAndUpdate<T extends Model>(
    filter: any,
    data: any,
  ): Promise<number> {
    try {
      const result = await this.model.findOne({ where: filter });
      if (!result) {
        throw new NotFoundException(`${this.model.name} record not found`);
      }
      const [affectedCount] = await this.model.update(data, { where: filter });

      return affectedCount;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findByIdAndUpdateWithTransaction(
    id: any,
    data: UpdateOptions<T>,
  ): Promise<T> {
    const t: Transaction = await this.model.sequelize.transaction();

    try {
      const [updatedCount, updatedRows] = await this.model.update(data, {
        where: { id },
        returning: true,
        individualHooks: true,
        transaction: t,
      });

      if (updatedCount === 0) {
        await t.rollback();
        throw new NotFoundException(`No record found with id: ${id}`);
      }

      await t.commit();
      return updatedRows[0] as T;
    } catch (e) {
      await t.rollback();
      throw new BadRequestException(e.message);
    }
  }

  generateNanoId(
    alphabeths = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    length = 8,
  ) {
    const nanoId = customAlphabet(alphabeths, length);
    return nanoId();
  }
  generateNanoIdTwo(length: number) {
    const alphabeths = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const nanoId = customAlphabet(alphabeths, length);
    return nanoId();
  }
  genereateUUID() {
    return uuidv4();
  }

  startOfTheMonth() {
    return moment().startOf('month').format('YYYY-MM-DD');
  }

  endOfTheMonth() {
    return moment().endOf('month').format('YYYY-MM-DD');
  }

  generateReferralCode(
    alphabeths = '0123456789abcdefghijklmnopqrstuvwxyz',
    length = 8,
  ) {
    const nanoId = customAlphabet(alphabeths, length);
    // return nanoId();
    return nanoId();
  }

  async getNearbyRecordsByCoordinates<T>(
    longitude: number,
    latitude: number,
    maxDistanceInKm: number,
    coordinatesField: string,
  ): Promise<T[]> {
    const sequelize = this.model.sequelize as Sequelize;
    return this.model.findAll<any>({
      where: sequelize.literal(`
        ST_Distance_Sphere(
          ST_MakePoint(${longitude}, ${latitude}),
          ${coordinatesField}
        ) <= ${maxDistanceInKm * 1000}
      `),
    });
  }

  kycRequestEncryptionHandler = <T>(data: T): string => {
    const iv = crypto.lib.WordArray.random(16);
    const encrypted = crypto.AES.encrypt(
      JSON.stringify(data),
      process.env.CRYPTO_SECRET,
      {
        iv,
        mode: crypto.mode.CBC,
        keySize: 128 / 8,
      },
    );

    // Combine IV and ciphertext into a single string
    const encryptedData = iv.toString() + encrypted.toString();
    return encryptedData;
  };

  kycRequestDecryptionHandler = <T>(data: string): T => {
    const iv = crypto.enc.Hex.parse(data.substr(0, 32)); // 32 characters for IV (16 bytes in hex)
    const ciphertext = data.substr(32);

    const decrypted = crypto.AES.decrypt(
      ciphertext,
      process.env.CRYPTO_SECRET,
      {
        iv,
        mode: crypto.mode.CBC,
        keySize: 128 / 8,
      },
    ).toString(crypto.enc.Utf8);
    return JSON.parse(decrypted);
  };

  async getNearbyRecordsByCoordinates1(
    coordinates: number[],
    maxDistanceInMeter: number,
    geoLocationKey: string,
  ) {
    const sequelize = this.model.sequelize;

    // Use placeholders for parameters
    const sequelizeQuery = `
      SELECT *,
      (6371000 * acos(cos(radians(?)) * cos(radians(${geoLocationKey}->>'latitude')) * cos(radians(${geoLocationKey}->>'longitude') - radians(?)) + sin(radians(?)) * sin(radians(${geoLocationKey}->>'latitude')))) AS distance
      FROM your_table
      HAVING distance <= ?
      ORDER BY distance
    `;

    const replacements = [
      coordinates[1],
      coordinates[0],
      coordinates[1],
      maxDistanceInMeter,
    ];

    return sequelize.query(sequelizeQuery, {
      type: 'SELECT', // Specify query type as a string
      mapToModel: true,
      replacements, // Pass the parameter values as an array
    });
  }

  async paginatedResult(options: PaginationOptionsDto<T>) {
    const { page = 1, limit = 10 } = options;

    const offset = (page - 1) * limit;

    const { rows, count } = await this.model.findAndCountAll({
      where: options.where,
      offset,
      limit,
      order: options.order,
      include: options.include,
      attributes: options.attributes,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    };
  }

  dateFormatter(date: Date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      weekday: 'short',
      year: 'numeric',
    });
  }

  dateFormatterWithTime(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      weekday: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  dayMonthYearDateFormatter1 = (dateStr: Date) => {
    const dateObj = new Date(dateStr);

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();

    return `${day}-${month}-${year}`;
  };

  dayMonthYearDateFormatter = (dateStr) => {
    const parseCustomDate = (dateString) => {
      const months = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
      const [day, monthStr, year] = dateString.split('-');
      const month = months[monthStr];

      return new Date(year, month, day);
    };

    const dateObj = parseCustomDate(dateStr);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();

    return `${day}-${month}-${year}`;
  };

  dayMonthYearDateFormatter2 = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');

    return `${day}-${month}-${year}`;
  };
  getFormattedTimestamp() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  currencyFormatter() {
    return Intl.NumberFormat('en-US');
  }

  currencyLogo = (country) => {
    let logo;
    switch (country) {
      case CountryEnum.NGN:
        logo = '₦';
        break;
      case CountryEnum.GHS:
        logo = '₵';
        break;
      case CountryEnum.USD:
        logo = '$';
        break;
      case CountryEnum.GBP:
        logo = '£';
        break;
      case CountryEnum.ZMW:
        logo = 'Z$';
        break;
      case CountryEnum.MXN:
        logo = '$';
        break;
      case CountryEnum.ZAR:
        logo = 'R';
        break;
      case CountryEnum.KES:
        logo = 'Ksh';
        break;
      case CountryEnum.TZS:
        logo = 'TZS';
        break;
      case CountryEnum.UGX:
        logo = 'UGX';
        break;
      case CountryEnum.RWF:
        logo = 'FRw';
        break;
    }
    return logo;
  };
}
