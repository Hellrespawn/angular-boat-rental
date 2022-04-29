import 'dotenv/config';
import { Boat } from '../model/boat.model';
import { User } from '../model/user.model';
import { Skipper } from '../model/skipper.model';
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

async function insertMockBoats(): Promise<void> {
  BOAT_NAMES.forEach(async (name, i) => {
    const boatType = ['sail', 'motor'][i % 2];

    const imageRoute =
      boatType == 'sail'
        ? SAILBOAT_PLACEHOLDER_PATH
        : MOTORBOAT_PLACEHOLDER_PATH;

    const maxOccupants = [8, 8, 16, 16][i % 4];
    const sailAreaInM2 = [100, undefined, 200, undefined][i % 4];
    const maxSpeedInKmH = [undefined, 10, undefined, 30][i % 4];

    await Boat.create({
      name,
      imageRoute,
      registrationNumber: randomInt(1, 10000),
      pricePerDay: randomInt(200, 500),
      skipperRequired: !(i % 3),
      maintenance: false,
      lengthInM: randomInt(10, 30),
      maxOccupants,
      boatType,
      sailAreaInM2,
      maxSpeedInKmH,
    });
  });
}

async function insertMockUsers(): Promise<void> {
  for (const name of CUSTOMER_NAMES) {
    const [firstName, lastName] = name.split(' ');
    await User.create({
      firstName,
      lastName,
      license: Boolean(randomInt(0, 1)),
      dateOfBirth: new Date('1991-01-01'),
      emailAddress: 'test@test.test',
      password: 'password',
      blocked: false,
    });
  }
}

async function insertMockSkippers(): Promise<void> {
  const skippers = SKIPPER_NAMES.map((name) => {
    const skipper = {
      name,
      pricePerDay: randomInt(100, 500),
      birthDate: randomDate(new Date(1980, 1, 1), new Date()),
      leave: false,
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

async function seed(): Promise<void> {
  try {
    await initSequelize();
    await insertMockBoats();
    await insertMockSkippers();
    await insertMockUsers();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seed();
