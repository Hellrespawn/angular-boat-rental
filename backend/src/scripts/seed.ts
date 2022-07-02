import { initSequelize } from '../database';
import { BoatModel } from '../database/boat.model';
import { RentalModel } from '../database/rental.model';
import { UserModel } from '../database/user.model';
import { User } from '../model/user';

const MOTORBOAT_PLACEHOLDER_PATH = 'motorboat-placeholder.jpg';

const SAILBOAT_PLACEHOLDER_PATH = 'sailboat-placeholder.jpg';

const BOAT_NAMES = [
  'The Holstein',
  'Grindall',
  'Ipswich',
  'Tiverton',
  'Decoy',
  'Danube',
  'The Cuffley',
  'Terrible',
  undefined,
  undefined,
  undefined,
  undefined,
];

const USER_NAMES = [
  'Stef Korporaal',
  'Kees van Ruler',
  'Hans den Otter',
  'Paul Jansen',
];

function randomInt(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function insertMockBoats(): Promise<void> {
  await Promise.all(
    BOAT_NAMES.map((name, i) => {
      const boatType = ['sail', 'motor'][i % 2];

      const imageRoute =
        boatType === 'sail'
          ? SAILBOAT_PLACEHOLDER_PATH
          : MOTORBOAT_PLACEHOLDER_PATH;

      const maxPassengers = [8, 8, 16, 16][i % 4];

      const sailAreaInM2 = [100, undefined, 200, undefined][i % 4];

      const maxSpeedInKmH = [undefined, 10, undefined, 30][i % 4];

      return BoatModel.create({
        name,
        imageRoute,
        registrationNumber: (i + 1) * 1000,
        pricePerDay: randomInt(200, 500),
        skipperRequired: !(i % 3),
        maintenance: false,
        lengthInM: randomInt(10, 30),
        maxPassengers,
        boatType,
        sailAreaInM2,
        maxSpeedInKmH,
      });
    })
  );
}

async function insertMockUsers(): Promise<void> {
  await Promise.all(
    USER_NAMES.map((name, index) => insertMockUser(name, index))
  );
}

async function insertMockUser(name: string, index: number): Promise<UserModel> {
  const [firstName, ...lastName] = name.split(' ');
  const emailAddress = name.split(' ').join('').toLowerCase() + '@test.com';

  return UserModel.create({
    firstName,
    lastName: lastName.join(' '),
    license: Boolean(randomInt(0, 1)),
    emailAddress,
    password: await User.hashPassword('abcdef1A'),
    blocked: false,
    admin: index === 0,
  });
}

async function insertMockRentals(): Promise<void> {
  const boats = await BoatModel.findAll();
  const users = await UserModel.findAll();

  const rentals: Promise<void>[] = [];

  for (let i = 0; i < Math.min(boats.length, users.length); i++) {
    rentals.push(insertMockRental(boats[i], users[users.length - 1 - i]));
  }

  await Promise.all(rentals);
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
    boatRegistrationNumber: boat.registrationNumber,
    userId: user.id,
    dateStart,
    dateEnd,
  });
}

async function seed(): Promise<void> {
  try {
    initSequelize();
    await insertMockBoats();
    await insertMockUsers();
    await insertMockRentals();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

void seed();
