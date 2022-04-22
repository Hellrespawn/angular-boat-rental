import { initSequelize } from './util/database';

async function sync() {
  try {
    await initSequelize({ force: true });

    console.log('ran succesfully');
  } catch (error) {
    console.error('got error');

    console.error(error);
  }
}

sync();
