import 'dotenv/config';
import { dropDatabase } from '../util/database';

(async () => {
  try {
    await dropDatabase();
    process.exit();
  } catch (error) {
    console.error(error);
  }
})();
