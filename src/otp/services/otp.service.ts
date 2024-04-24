import { ConflictException, Injectable } from '@nestjs/common';
import { OtpDto } from '../dtos/otp.dto';
import { OtpTypeEnum } from '../enums/otp.enum';
import { Otp } from '../model/otp.model';
import { BaseService } from '@app/my-library/db/db.service';
import { ModelCtor } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class OtpService extends BaseService<Otp> {
  constructor(
    @InjectModel(Otp)
    private readonly otpModel: ModelCtor<Otp>,
  ) {
    super(otpModel);
  }

  async generateCode(receiver: string, type: OtpTypeEnum): Promise<Otp> {
    const date = new Date().getTime();
    //   expire in ten minutes
    const expirationDate = new Date(date + 600000);
    await this.deleteOtpEntries(receiver, type);

    // generate random 4 digits
    const code = Math.floor(100000 + Math.random() * 90000);

    return this.otpModel.create({
      receiver,
      code: code.toString(),
      type,
      expirationDate,
    });
  }

  private async deleteOtpEntries(
    receiver: string,
    type: OtpTypeEnum,
  ): Promise<void> {
    await this.otpModel.destroy({
      where: {
        receiver: receiver,
        type: type,
      },
    });
  }

  async generateProviderCode(
    receiver: string,
    type: OtpTypeEnum,
    code: string,
  ): Promise<Otp> {
    const date = new Date().getTime();
    //   expire in ten minutes
    const expirationDate = new Date(date + 3000000);
    await this.deleteOtpEntries(receiver, type);
    let model = await this.otpModel.findOne({
      where: { receiver, type, code },
    });
    if (model) {
      await this.update(model.id, {
        receiver,
        code: code.toString(),
        type,
        expirationDate,
      });
    } else {
      model = new Otp({
        receiver,
        code: code.toString(),
        type,
        expirationDate,
      });
    }

    return await model.save();
  }
  /*
  async verify(data: OtpDto) {
    const { code, id, type } = data;
    const foundCode = await this.findOneOrErrorOut({
      where: { code, id, type },
    });
    if (!foundCode) {
      throw new ConflictException('Invalid verification code');
    }
    if (new Date(foundCode.expirationDate).getTime() < new Date().getTime()) {
      await this.otpModel.destroy({
        where: { code, id, type },
      });
      throw new ConflictException('Code has expired please try again');
    }
    await this.otpModel.destroy({
      where: { code, id },
    });
    return true;
  }
  */

  /* async verify(data: OtpDto) {
    const { code, id, type } = data;
    const foundCode = await this.findOneOrErrorOut({
      where: { code, id, type },
    });
    if (!foundCode) {
      throw new ConflictException('Invalid verification code');
    }

    // Calculate the new expiration datetime (current datetime + 25 minutes)
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 25);

    // Check if the found code has expired
    if (new Date(foundCode.expirationDate).getTime() < new Date().getTime()) {
      await this.otpModel.destroy({
        where: { code, id, type },
      });
    //  throw new ConflictException('Code has expired please try again');
    }
    // Update the expiration datetime to the new value
    await this.otpModel.update({
      expirationDate: expirationDate,
    }, {
      where: { code, id, type },
    });

    return true;
}
*/
  async verify(data: OtpDto) {
    const { code, id, type } = data;
    const foundCode = await this.findOneOrErrorOut({
      where: { code, id, type },
    });
    if (!foundCode) {
      throw new ConflictException('Invalid verification code');
    }

    /*
  // Check if the found code has expired
  const currentDateTime = new Date();
  if (new Date(foundCode.expirationDate) < currentDateTime) {
    await this.otpModel.destroy({
      where: { code, id, type },
    });
    throw new ConflictException('Code has expired please try again');
    
  }
  */
    const currentDateTime = new Date();
    // Calculate the new expiration datetime (current datetime + 25 minutes)
    const expirationDate = new Date(currentDateTime.getTime() + 25 * 60000);

    // Update the expiration datetime to the new value
    await this.otpModel.update(
      {
        expirationDate: expirationDate,
      },
      {
        where: { code, id, type },
      },
    );

    return true;
  }

  async verifySms(data) {
    const foundCode = await this.otpModel.findOne(data);
    // if (!foundCode) {
    //   throw new ConflictException('Invalid verification code');
    // }

    if (
      foundCode &&
      new Date(foundCode.expirationDate).getTime() < new Date().getTime()
    ) {
      throw new ConflictException('Code has expired please try again');
    }

    return foundCode;
  }
}
