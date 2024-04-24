import { BaseEnvConfig } from '@app/my-library/env/enum/env.enum';

// put the env variables for the app here
export const ConfigEnum = {
  ...BaseEnvConfig,
  NODE_ENV: 'NODE_ENV',
};

export enum EnvNodeEnv {
  Local = 'local',
  Development = 'development',
  Production = 'production',
  Testing = 'testing',
}
