import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import mysql, { Connection } from 'mysql2/promise';

import { SkipperModel } from './skipper.dao';
import { BoatModel } from './boat.dao';
import { RentalModel } from './rental.dao';
import { MessageModel } from './message.dao';
import { FineModel } from './fine.dao';
import { SessionModel } from './session.dao';
import { UserModel } from './user.dao';

export const MODELS = [
  SkipperModel,
  BoatModel,
  UserModel,
  RentalModel,
  MessageModel,
  FineModel,
  SessionModel,
];

/**
 * Initialize Sequelize with environment variables.
 *
 * @param options Additional options
 * @returns Sequelize instance
 */
export async function initSequelize(
  options?: SequelizeOptions
): Promise<Sequelize> {
  const sequelize = new Sequelize(
    process.env.DB_NAME ?? 'dogstack-het-vrolijke-avontuur',
    process.env.DB_USER ?? 'root',
    process.env.DB_PASSWORD ?? 'password',
    {
      dialect: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306'),
      omitNull: true,
      ...options,
    }
  );

  sequelize.addModels(MODELS);

  return sequelize;
}

/**
 * Directly connect to MySQL database
 * @returns Connection
 */
async function createConnection(): Promise<Connection> {
  return mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306'),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? 'password',
  });
}

/**
 * Create database if it doesn't already exist
 * @returns
 */
export async function createDatabase(): Promise<void> {
  const connection = await createConnection();
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${
      process.env.DB_NAME ?? 'dogstack-het-vrolijke-avontuur'
    }\`;`
  );
  connection.destroy();
}

export async function dropDatabase(): Promise<void> {
  const connection = await createConnection();
  await connection.query(
    `DROP DATABASE IF EXISTS \`${
      process.env.DB_NAME ?? 'dogstack-het-vrolijke-avontuur'
    }\`;`
  );
  connection.destroy();
}
