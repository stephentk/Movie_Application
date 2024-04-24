import { ConfigEnum, EnvNodeEnv } from './../enum/env.enum';
import { baseEnvValidator } from '@app/my-library/env/validator/env.validator';
import * as Joi from 'joi';

// extend from the base needed in the library
export const envValidator = baseEnvValidator.append({
  [ConfigEnum.NODE_ENV]: Joi.string()
    .valid(...Object.values(EnvNodeEnv))
    .required(),
});
