import 'dotenv/config';
import { Boat, BoatData } from '../model/boat.model';
import { Skipper, SkipperData } from '../model/skipper.model';
import '../util/database';
import { initSequelize } from '../util/database';

const MOTORBOAT_PLACEHOLDER_PATH = 'motorboot-placeholder.jpg';

const SAILBOAT_PLACEHOLDER_PATH = 'zeilboot-placeholder.jpg';

const BOAT_NAMES = [
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

const SKIPPER_NAMES = [
  'Jantje de Wit',
  'Pietje van Vlugt',
  'Klaasje de Koning',
  'Henkie Aardenburg',
  'Peter Mijnen',
  'Bert Buwalda',];

function randomInt(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function insertMockBoats() {
  const boats = BOAT_NAMES.map((name): BoatData => {
    const boatType = randomInt(0, 1) ? 'sail' : 'motor';

    const imageRoute =
      boatType == 'sail'
        ? SAILBOAT_PLACEHOLDER_PATH
        : MOTORBOAT_PLACEHOLDER_PATH;

    let boat;

    if (boatType == 'sail') {
      boat = {
        name,
        registrationNumber: randomInt(1, 10000),
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
        registrationNumber: randomInt(1, 10000),
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

  for (const boat of boats) {
    try {
      await Boat.create(boat);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

async function insertMockSkippers() {
  const skippers = SKIPPER_NAMES.map((name): SkipperData => {
    let skipper;
      skipper = {
        name,
        pricePerDay: randomInt(100, 500),
        birthDate: randomDate(new Date(1980, 1, 1), new Date())
      }
    return skipper;
  });

  for (const skipper of skippers) {
    try {
      await Skipper.create(skipper);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

(async () => {
  await initSequelize();
  await insertMockBoats();
  await insertMockSkippers();
  process.exit();
})();
