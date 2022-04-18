import 'regenerator-runtime';
import { Sequelize } from 'sequelize-typescript';
import {
  createDatabase,
  dropDatabase,
  initSequelize,
} from '../src/util/database';

export let sequelize: Sequelize;

const DB_NAME = 'TEST_DB';

export async function initDatabase(): Promise<Sequelize> {
  await dropDatabase(DB_NAME);
  await createDatabase(DB_NAME);
  sequelize = await initSequelize('TEST_DB', { logging: false });
  await sequelize.sync();
  return sequelize;
}

export async function closeDatabase(): Promise<void> {
  await dropDatabase(DB_NAME);
}
