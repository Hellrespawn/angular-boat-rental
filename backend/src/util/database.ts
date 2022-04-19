import { Sequelize } from 'sequelize-typescript';
import mysql, { Connection } from 'mysql2/promise';
import { MODELS } from '../model';

const DB_NAME = process.env.DB_NAME ?? 'dogstack-het-vrolijke-avontuur';
const DB_USER = process.env.DB_USER ?? 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ?? 'password';
const DB_HOST = process.env.DB_HOST ?? 'localhost';
const DB_PORT = +(process.env.DB_PORT ?? 3306);

export async function initSequelize(
  name?: string,
  options?: { name?: string; logging?: boolean }
): Promise<Sequelize> {
  name = name ?? DB_NAME;

  const sequelize = new Sequelize(name, DB_USER, DB_PASSWORD, {
    dialect: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    omitNull: true,
    ...options,
  });

  sequelize.addModels(MODELS);

  return sequelize;
}

async function createConnection(): Promise<Connection> {
  return mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });
}

export async function createDatabase(name?: string): Promise<Connection> {
  const connection = await createConnection();
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${name ?? DB_NAME}\`;`
  );
  return connection;
}

export async function dropDatabase(name?: string): Promise<Connection> {
  const connection = await createConnection();
  await connection.query(`DROP DATABASE IF EXISTS \`${name ?? DB_NAME}\`;`);
  return connection;
}
