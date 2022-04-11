import 'dotenv/config';
import { initSequelize } from '../util/database';

(async () => {
  try {
    const sequelize = await initSequelize();
    await sequelize.drop();
    process.exit();
  } catch (error) {
    console.error(error);
  }
})();
