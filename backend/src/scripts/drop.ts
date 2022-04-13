import 'dotenv/config';
import { dropDatabase } from '../util/database';

async function drop(): Promise<void> {
  try {
    await dropDatabase();
    console.log(`Dropped database.`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

drop();
