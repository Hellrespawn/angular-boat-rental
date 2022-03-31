import { Sequelize } from "sequelize-typescript";
import mysql2 from 'mysql2';
import { Models } from "../models";

export const sequelize = new Sequelize({
  database: "database_botenverhuur",
  dialect: "mysql",
  dialectModule: mysql2,
  username: "root",
  password: "Ikben25!",
});

export async function initSequelize(
  opts: { force?: boolean } = { force: false }
): Promise<void> {
  sequelize.addModels(Models);

  sequelize.sync(opts);
}