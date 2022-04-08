import { Sequelize } from 'sequelize-typescript';
import mysql from 'mysql2/promise';
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
  });

  sequelize.addModels(MODELS);

  return sequelize;
}

export async function createDatabase(): Promise<void> {
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
}
