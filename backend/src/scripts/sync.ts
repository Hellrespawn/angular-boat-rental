import 'dotenv/config';
import { createDatabase, initSequelize } from '../database';

async function sync(): Promise<void> {
  try {
    const sequelize = await initSequelize();
    await createDatabase();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error(error);
  }

  process.exit();
}

sync();
