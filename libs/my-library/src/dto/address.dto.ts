import { CountryEnum } from '../enum/country.enum';

export class AddressDto {
  countryCode: CountryEnum;
  country: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}
