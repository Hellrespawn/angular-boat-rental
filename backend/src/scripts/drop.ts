import 'dotenv/config';
import { dropDatabase } from '../persistence';

async function drop(): Promise<void> {
  try {
    await dropDatabase();
    console.log(`Dropped database.`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

void drop();
