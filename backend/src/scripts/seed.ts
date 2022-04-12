import 'dotenv/config';
import { Boat, BoatData } from '../model/boat.model';
import { Customer } from '../model/customer.model';
import { Skipper, SkipperData } from '../model/skipper.model';
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
];

const CUSTOMER_NAMES = [
  'Baran Enriquez',
  'Chloe-Ann Bryant',
  'Lyndsey Chamberlain',
  'Deacon Mays',
];

const SKIPPER_NAMES = [
  'Jantje de Wit',
  'Pietje van Vlugt',
  'Klaasje de Koning',
  'Henkie Aardenburg',
  'Peter Mijnen',
  'Bert Buwalda',
];

function randomInt(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function insertMockBoats() {
  for (const name of BOAT_NAMES) {
    const boatType = randomInt(0, 1) ? 'sail' : 'motor';

    const imageRoute =
      boatType == 'sail'
        ? SAILBOAT_PLACEHOLDER_PATH
        : MOTORBOAT_PLACEHOLDER_PATH;

    const sailAreaInM2 = boatType === 'sail' ? randomInt(100, 200) : undefined;

    const maxSpeedInKmH = boatType === 'motor' ? randomInt(10, 30) : undefined;

    await Boat.create({
      name,
      registrationNumber: randomInt(1, 10000),
      imageRoute,
      pricePerDay: randomInt(200, 500),
      skipperRequired: Boolean(randomInt(0, 1)),
      maintenance: Boolean(randomInt(0, 1)),
      lengthInM: randomInt(10, 30),
      maxOccupants: randomInt(8, 16),
      boatType,
      sailAreaInM2,
      maxSpeedInKmH,
    });
  }
}

async function insertMockCustomers() {
  for (const name of CUSTOMER_NAMES) {
    const [firstName, lastName] = name.split(' ');
    await Customer.create({
      firstName,
      lastName,
      license: Boolean(randomInt(0, 1)),
      dateOfBirth: new Date('1991-01-01'),
      emailAddress: 'test@test.test',
      password: 'password',
    });
  }
}

async function insertMockSkippers() {
  const skippers = SKIPPER_NAMES.map((name): SkipperData => {
    const skipper = {
      name,
      pricePerDay: randomInt(100, 500),
      birthDate: randomDate(new Date(1980, 1, 1), new Date()),
    };
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
  try {
    await initSequelize();
    await insertMockBoats();
    await insertMockSkippers();
    await insertMockCustomers();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
