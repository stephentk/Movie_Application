import { DataTypes } from 'sequelize';
import { CountryCodeEnum } from '../enum/country.enum';

export const PhoneNumberSchema = {
  code: {
    type: DataTypes.STRING,
    enum: Object.values(CountryCodeEnum),
    allowNull: false,
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verified: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
