import 'dotenv/config';
import { initSequelize } from '../util/database';

(async () => {
  const sequelize = await initSequelize();
  await sequelize.drop();
  process.exit();
})();
