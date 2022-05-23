import request from 'supertest';
import { BoatModel } from '../../src/database/boat.dao';
import { app } from '../../src/server';
import { expect } from 'chai';
import { closeDatabase, initDatabase } from '../mocha-setup';
import { User } from '../../src/model/user';
import { RentalModel } from '../../src/database/rental.dao';
import { UserModel } from '../../src/database/user.dao';

async function seedDatabase(): Promise<BoatModel> {
  const boat = await BoatModel.create({
    name: 'testboat',
    registrationNumber: 1234,
    pricePerDay: 1234,
    skipperRequired: false,
    maintenance: false,
    imageRoute: '',
    lengthInM: 1234,
    maxOccupants: 1234,
    boatType: 'motor',
    maxSpeedInKmH: 1234,
    sailAreaInM2: undefined,
  });

  const user = await UserModel.create({
    firstName: 'Stef',
    lastName: 'Korporaal',
    license: true,
    dateOfBirth: new Date('1991-09-25'),
    emailAddress: 'stef@test.nl',
    password: await User.hashPassword('password'),
    blocked: false,
    admin: true,
  });

  await RentalModel.create({
    boatId: boat.id,
    userId: user.id,
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-01-10'),
    paid: true,
  });

  return boat;
}

describe('Test /boats/:id/bookedDates', () => {
  let boat: BoatModel;

  before(async () => {
    await initDatabase();
    boat = await seedDatabase();
  });

  after(closeDatabase);

  describe('GET /boats/:id/bookedDates', () => {
    it('Responds with an array of booked dates', async () => {
      const res = await request(app).get(`/boats/${boat.id}/bookedDates`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        dates: [
          '2022-01-01T00:00:00.000Z',
          '2022-01-02T00:00:00.000Z',
          '2022-01-03T00:00:00.000Z',
          '2022-01-04T00:00:00.000Z',
          '2022-01-05T00:00:00.000Z',
          '2022-01-06T00:00:00.000Z',
          '2022-01-07T00:00:00.000Z',
          '2022-01-08T00:00:00.000Z',
          '2022-01-09T00:00:00.000Z',
          '2022-01-10T00:00:00.000Z',
        ],
      });
    });
  });

  describe('Test /boats/overview/available/:dateStart/:dateEnd', () => {
    it('Responds with an empty array when no boats are available', async () => {
      const res = await request(app).get(
        '/boats/overview/available/2022-01-01/2022-01-10'
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ boats: [] });
    });

    it('Responds with BoatOverviewData when boats are available', async () => {
      const res = await request(app).get(
        '/boats/overview/available/2022-02-01/2022-02-10'
      );

      expect(res.status).to.equal(200);

      const { boats } = res.body;

      expect(boats.length).to.equal(1);
      expect(boats[0].id).to.equal(boat.id);
    });

    it('Responds with an error on a malformed date', async () => {
      const res = await request(app).get(
        '/boats/overview/available/2022-02-01/2022-02-0'
      );

      expect(res.status).to.equal(400);

      const { error } = res.body;
      expect(error).to.contain('Invalid date');
    });
  });
});
