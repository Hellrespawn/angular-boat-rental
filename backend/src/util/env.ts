import 'dotenv/config';
import { ServerError } from './error';

export type EnvVar = Record<string, string>;

const ENV_VAR = {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  SRV_PORT: process.env.SRV_PORT,
};

export function getEnvVar(): EnvVar {
  for (const [key, value] of Object.entries(ENV_VAR)) {
    if (!value) {
      throw new ServerError(`Unable to read ${key} from process.env.`);
    }
  }

  return ENV_VAR as EnvVar;
}
