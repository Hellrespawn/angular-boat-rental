import 'dotenv/config';
import { Boat } from '../model/boat.model';
import '../util/database';
import { initSequelize } from '../util/database';

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
  const boats = NAMES.map((name) => {
    const boatType = randomInt(0, 1) ? 'sail' : 'motor';
    let boat;
    if (boatType == 'sail') {
      boat = {
        name,
        registrationNumber: randomInt(100, 10000),
        pricePerDay: randomInt(200, 500),
        skipperNeeded: Boolean(randomInt(0, 1)),
        maintenance: false,
        photo: null,
        length: randomInt(10, 30),
        maxOccupants: randomInt(8, 16),
        boatType,
        sailAreaInM2: randomInt(100, 200),
      };
    } else {
      boat = {
        name,
        registrationNumber: randomInt(100, 10000),
        pricePerDay: randomInt(200, 500),
        skipperNeeded: Boolean(randomInt(0, 1)),
        maintenance: false,
        photo: null,
        length: randomInt(10, 30),
        maxOccupants: randomInt(8, 16),
        boatType,
        maxSpeedInKmH: randomInt(10, 30),
      };
    }

    return boat;
  });

  return Promise.all(boats.map((boat) => Boat.create(boat)));
}

(async () => {
  await initSequelize();
  await insertMockBoats();
  process.exit();
})();
