import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class AppConfigs extends Model<AppConfigs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    defaultValue: true,
  })
  isIdentityPassAvailable: boolean;

  @Column({
    defaultValue: true,
  })
  isDojahAvailable: boolean;

  @Column
  source: string;

  @Column({
    defaultValue: true,
  })
  isAirtimeAvailable: boolean;

  @Column({
    defaultValue: true,
  })
  isCableAvailable: boolean;

  @Column({
    defaultValue: true,
  })
  isDataBundleAvailable: boolean;

  @Column({
    defaultValue: true,
  })
  isElectricityAvailable: boolean;

  @Column({
    defaultValue: true,
  })
  isLoginAvailable: boolean;

  @Column({
    defaultValue: true,
  })
  isMobileMoneyAvailable: boolean;

  @Column
  qualAmountNgn: number;

  @Column
  qualAmountGhs: number;

  @Column
  qualAmountKes: number;

  @Column
  bonusAmountNgn: number;

  @Column
  bonusAmountNGhs: number;

  @Column
  bonusAmountKes: number;

  @Column
  ngnWithdrawalCharges: number;

  @Column
  ghsWithdrawalCharges: number;

  @Column
  cardFundingCharges: number;

  @Column
  virtualCardCreationChargesInKobo: number;

  @Column
  virtualCardCreationChargesInGhs: number;

  @Column
  virtualCardCreationChargesInGbp: number;

  @Column
  virtualCardCreationChargesInZmw: number;

  @Column
  platinumMembershipMonthly: number;

  @Column
  virtualCardCreationChargesInUsd: number;

  @Column
  platinumMembershipYearly: number;

  @Column
  businessMembershipMonthly: number;

  @Column
  businessMembershipYearly: number;

  @Column
  eb2niwOneOnDemand: number;

  @Column
  eb2niwOneOnDemandImage: string;

  @Column
  eb2niwAi: number;

  @Column
  eb2niwAiImage: string;

  @Column
  ngnToGbpConversionRate: number;

  @Column
  ngnToGhsConversionRate: number;

  @Column
  ngnReferrerAmount: number;

  @Column
  ghsReferrerAmount: number;

  @Column
  usdReferrerAmount: number;

  @Column
  gbpReferrerAmount: number;

  @Column
  zmwReferrerAmount: number;

  @Column
  cardDeliveryChargeOutsideLagos: number;

  @Column
  cardDeliveryChargeWithinLagos: number;
}
