import 'dotenv/config';
import { createDatabase, initSequelize } from '../persistence';

async function sync(): Promise<void> {
  try {
    await createDatabase();
    const sequelize = initSequelize();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error(error);
  }

  process.exit();
}

void sync();
