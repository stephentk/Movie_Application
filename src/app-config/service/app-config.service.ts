import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '@app/my-library/db/db.service';
import { ModelCtor } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AppConfigs } from '../model/app-config.model';
import { AppConfigDto, AppConfigSearchDto } from '../dto/app-config.dto';

import { CountryEnum } from '@app/my-library/enum/country.enum';

@Injectable()
export class AppConfigService extends BaseService<AppConfigs> {
  constructor(
    @InjectModel(AppConfigs)
    private readonly appConfigModel: ModelCtor<AppConfigs>,
  ) {
    super(appConfigModel);
  }

  initialize = (data: AppConfigDto) => {
    return new AppConfigs(data);
  };

  search = async (query: AppConfigSearchDto) => {
    const where: any = {};
    const options: any = { page: query.page, limit: query.limit, where };

    if (query.bonusAmountKes) {
      where.bonusAmountKes = query.bonusAmountKes;
    }
    if (query.businessMembershipMonthly) {
      where.businessMembershipMonthly = query.businessMembershipMonthly;
    }

    const searchdata = query.search
      ? {
          [Op.or]: [
            {
              bonusAmountKes: {
                [Op.like]: `%${query.search}%`,
              },
            },
            {
              businessMembershipMonthly: {
                [Op.like]: `%${query.search}%`,
              },
            },
          ],
        }
      : null;
    if (query.startDate) {
      where.createdAt = {
        ...where.createdAt,
        [Op.gte]: query.startDate,
      };
    }

    if (query.endDate) {
      where.createdAt = {
        ...where.createdAt,
        [Op.lte]: query.endDate,
      };
    }
    options.where = { ...where, ...searchdata };
    options.order = [['createdAt', 'DESC']];

    return await this.paginatedResult(options);
  };

  getCardFundingChargesValue = async (service: CountryEnum) => {
    // Retrieve configuration data for card funding charges
    const config = await this.findOne({
      where: { source: 'vesti' },
    });

    switch (service) {
      case CountryEnum.NGN:
        // Return card funding charges for NGN
        return config.cardFundingCharges;
      case CountryEnum.GHS:
        // Return card funding charges for GHS
        return config.cardFundingCharges;
      case CountryEnum.GBP:
        // Return card funding charges for GHS
        return config.cardFundingCharges;
      case CountryEnum.ZMW:
        // Return card funding charges for GHS
        return config.cardFundingCharges;
      case CountryEnum.ZMW:
        // Return card funding charges for GHS
        return 100;
      default:
        // Return card funding charges for other currencies or handle differently if needed
        return config.cardFundingCharges;
    }
  };

  withdrawalChargesValue = async (service: CountryEnum) => {
    // Generate a random 4-digit number
    let amount: number;
    const config = await this.findOne({ where: { source: 'vesti' } });
    switch (service) {
      case CountryEnum.NGN:
        amount = config.ngnWithdrawalCharges;
        break;
      case CountryEnum.GHS:
        amount = config.ghsWithdrawalCharges;
        break;
      default:
        return 0;
      /** Add other currencies as we expand **/
    }
    return amount;
  };

  getVirtualCardCreationChargesValue = async (service: CountryEnum) => {
    // Retrieve configuration data for card funding charges
    const config = await this.findOne({
      where: { source: 'vesti' },
    });

    switch (service) {
      case CountryEnum.NGN:
        // Return card funding charges for NGN
        return config.virtualCardCreationChargesInKobo;
      case CountryEnum.GHS:
        // Return card funding charges for GHS
        return config.virtualCardCreationChargesInGhs;
      case CountryEnum.GBP:
        // Return card funding charges for GHS
        return config.virtualCardCreationChargesInGbp;
      case CountryEnum.ZMW:
        // Return card funding charges for GHS
        return config.virtualCardCreationChargesInZmw;
      case CountryEnum.USD:
        // Return card funding charges for USD
        return config.virtualCardCreationChargesInUsd;
      default:
        // Return card funding charges for other currencies or handle differently if needed
        return config.virtualCardCreationChargesInKobo;
    }
  };

  nairToOtherCurrencyConversions = async (service: CountryEnum) => {
    // Generate a random 4-digit number
    let amount: number;
    const config = await this.findOne({
      where: { source: 'vesti' },
    });
    switch (service) {
      case CountryEnum.GBP:
        amount = config.ngnToGbpConversionRate;
        break;
      case CountryEnum.GHS:
        amount = config.ngnToGhsConversionRate;
        break;
      case CountryEnum.USD:
        amount = config.ngnToGhsConversionRate;
        break;
      default:
        return new BadRequestException('Invalid wallet');

      /** Add other currencies as we expand **/
    }
    return amount / 100;
  };
}
