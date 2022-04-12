import { Sequelize } from 'sequelize-typescript';
import mysql, { Connection } from 'mysql2/promise';
import { MODELS } from '../model';

const database = process.env.DB_NAME ?? 'dogstack-het-vrolijke-avontuur';
const user = process.env.DB_USER ?? 'root';
const password = process.env.DB_PASSWORD ?? 'password';
const host = process.env.DB_HOST ?? 'localhost';
const port = +(process.env.DB_PORT ?? 3306);

export async function initSequelize(): Promise<Sequelize> {
  const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    host,
    port,
    omitNull: true,
  });

  sequelize.addModels(MODELS);

  return sequelize;
}

async function createConnection(): Promise<Connection> {
  return mysql.createConnection({
    host,
    port,
    user,
    password,
  });
}

export async function createDatabase(): Promise<void> {
  const connection = await createConnection();
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
}

export async function dropDatabase(): Promise<void> {
  const connection = await createConnection();
  await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
}
