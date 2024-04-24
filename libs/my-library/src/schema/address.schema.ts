import { DataTypes } from 'sequelize';
import { CountryEnum } from '../enum/country.enum';

export const CountrySchema = {
  countryCode: {
    type: DataTypes.STRING,
    enum: Object.values(CountryEnum),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
