import 'dotenv/config';
import { Boat, BoatData } from '../model/boat.model';
import '../util/database';
import { initSequelize } from '../util/database';

const MOTORBOAT_PLACEHOLDER_PATH = 'motorboot-placeholder.jpg';

const SAILBOAT_PLACEHOLDER_PATH = 'zeilboot-placeholder.jpg';

const NAMES = [
  'The Holstein',
  'Grindall',
  'Ipswich',
  'Tiverton',
  'Decoy',
  'Danube',
  'The Cuffley',
  'Terrible',
  'Scotstoun',
  'Sturgeon',
];

function randomInt(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function insertMockBoats() {
  const boats = NAMES.map((name): BoatData => {
    const boatType = randomInt(0, 1) ? 'sail' : 'motor';

    const imageRoute =
      boatType == 'sail'
        ? SAILBOAT_PLACEHOLDER_PATH
        : MOTORBOAT_PLACEHOLDER_PATH;

    let boat;

    if (boatType == 'sail') {
      boat = {
        name,
        imageRoute,
        pricePerDay: randomInt(200, 500),
        skipperRequired: Boolean(randomInt(0, 1)),
        maintenance: Boolean(randomInt(0, 1)),
        lengthInM: randomInt(10, 30),
        maxOccupants: randomInt(8, 16),
        boatType,
        sailAreaInM2: randomInt(100, 200),
      };
    } else {
      boat = {
        name,
        imageRoute,
        pricePerDay: randomInt(200, 500),
        skipperRequired: Boolean(randomInt(0, 1)),
        maintenance: Boolean(randomInt(0, 1)),
        lengthInM: randomInt(10, 30),
        maxOccupants: randomInt(8, 16),
        boatType,
        maxSpeedInKmH: randomInt(10, 30),
      };
    }

    return boat;
  });

  return Promise.all(
    boats.map((boat) => {
      try {
        Boat.create(boat);
      } catch (error) {
        console.log(error);
      }
    })
  );
}

(async () => {
  await initSequelize();
  await insertMockBoats();
  process.exit();
})();
