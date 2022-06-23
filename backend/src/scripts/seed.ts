import 'dotenv/config';
import { BoatModel } from '../database/boat.dao';
import { SkipperModel } from '../database/skipper.dao';
import { RentalModel } from '../database/rental.dao';
import { initSequelize } from '../database';
import { UserModel } from '../database/user.dao';
import { User } from '../model/user';

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

const USER_NAMES = [
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

    await BoatModel.create({
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
  for (let i = 0; i < USER_NAMES.length; i++) {
    const name = USER_NAMES[i];
    const [firstName, lastName] = name.split(' ');
    await UserModel.create({
      firstName,
      lastName,
      license: Boolean(randomInt(0, 1)),
      emailAddress: `test${i}@test.test`,
      password: await User.hashPassword('password'),
      blocked: false,
      admin: i === 0 ? true : false,
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
      await SkipperModel.create(skipper);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}

async function insertMockRentals(): Promise<void> {
  const boats = await BoatModel.findAll();
  const users = await UserModel.findAll();

  for (let i = 0; i < Math.min(boats.length, users.length); i++) {
    await insertMockRental(boats[i], users[users.length - 1 - i]);
  }
}

async function insertMockRental(
  boat: BoatModel,
  user: UserModel
): Promise<void> {
  const dateStart = new Date();
  dateStart.setDate(dateStart.getDate() + randomInt(3, 60));

  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateEnd.getDate() + randomInt(4, 8));

  await RentalModel.create({
    boatId: boat.id,
    userId: user.id,
    dateStart,
    dateEnd,
  });
}

async function seed(): Promise<void> {
  try {
    await initSequelize();
    await insertMockBoats();
    await insertMockSkippers();
    await insertMockUsers();
    await insertMockRentals();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seed();
