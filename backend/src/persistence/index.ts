import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import mysql, { Connection } from 'mysql2/promise';

import { BoatModel } from './boat.model';
import { RentalModel } from './rental.model';
import { SessionModel } from './session.model';
import { UserModel } from './user.model';
import { getEnvVar } from '../util/env';

export const MODELS = [BoatModel, UserModel, RentalModel, SessionModel];

/**
 * Initialize Sequelize with environment variables.
 *
 * @param options Additional options
 * @returns Sequelize instance
 */
export function initSequelize(options?: SequelizeOptions): Sequelize {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = getEnvVar();

  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: 'mysql',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    omitNull: true,
    ...options,
  });

  sequelize.addModels(MODELS);

  return sequelize;
}

/**
 * Directly connect to MySQL database
 * @returns Connection
 */
function createConnection(): Promise<Connection> {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = getEnvVar();
  return mysql.createConnection({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
  });
}

/**
 * Create database if it doesn't already exist
 * @returns
 */
export async function createDatabase(): Promise<void> {
  const connection = await createConnection();

  const { DB_NAME } = getEnvVar();

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  connection.destroy();
}

export async function dropDatabase(): Promise<void> {
  const connection = await createConnection();

  const { DB_NAME } = getEnvVar();

  await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
  connection.destroy();
}
