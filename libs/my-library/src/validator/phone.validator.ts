import * as Joi from 'joi';
import { CountryCodeEnum } from '../enum/country.enum';

export const phoneNumberValidator = Joi.object({
  code: Joi.string()
    .trim()
    .valid(...Object.values(CountryCodeEnum))
    .required(),
  number: Joi.alternatives()
    .conditional('code', {
      switch: [
        {
          is: CountryCodeEnum.NGN,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.USA,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.GHS,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.MXN,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.ZMW,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.GBP,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.ZAR,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.UGX,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.KES,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.TZS,
          then: Joi.string().trim().min(10).max(10).required(),
        },
        {
          is: CountryCodeEnum.RWF,
          then: Joi.string().trim().min(10).max(10).required(),
        },
      ],
    })
    .required(),

  local: Joi.string().trim(),
}).custom((value) => {
  switch (value.code) {
    case CountryCodeEnum.NGN:
      //for nigerian numbers add 0 to the front of the number
      value.local = `0${value.number}`;
      break;
    case CountryCodeEnum.USA:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.GBP:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.GHS:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.ZMW:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.MXN:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.KES:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.RWF:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.TZS:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.ZAR:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    case CountryCodeEnum.UGX:
      // for the USA only the 10 digits numbers are considered to be local numbers
      value.local = value.number;
      break;
    // TODO: AS THE COMPANY EXPANDS TO OTHER COUNTRIES ADD RULES HERE, TO ENSURE THAT WE HAVE THE RIGHT VALUE FOR LOCAL. phoneNumber.local can be used alongside email to login to the platform
  }
  return value;
});
