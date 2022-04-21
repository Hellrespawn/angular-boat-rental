import 'dotenv/config';
import 'regenerator-runtime';
import { Sequelize } from 'sequelize-typescript';
import {
  createDatabase,
  dropDatabase,
  initSequelize,
} from '../src/util/database';

export let sequelize: Sequelize;

export async function initDatabase(): Promise<Sequelize> {
  // Writes without newline
  process.stdout.write('Initializing test database... ');
  process.env.DB_NAME = 'TEST_DB';
  await dropDatabase();
  await createDatabase();
  sequelize = await initSequelize({ logging: false });
  await sequelize.sync();
  console.log('Done.');
  return sequelize;
}

export async function closeDatabase(): Promise<void> {
  process.stdout.write('Dropping test database... ');
  await dropDatabase();
  console.log('Done.');
}
