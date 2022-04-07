import 'dotenv/config';
import { createDatabase, initSequelize } from '../util/database';

(async () => {
  const sequelize = await initSequelize();
  await createDatabase();
  await sequelize.sync();

  process.exit();
})();
