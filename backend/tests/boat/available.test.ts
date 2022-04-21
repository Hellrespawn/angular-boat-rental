import request from 'supertest';
import { Boat } from '../../src/model/boat.model';
import { app } from '../../src/server';
import { expect } from 'chai';
import { closeDatabase, initDatabase } from '../mocha-setup';
import { Customer } from '../../src/model/customer.model';
import { Rental } from '../../src/model/rental.model';

describe('Test Boat', () => {
  let boat: Boat;
  let customer: Customer;

  before(async () => {
    await initDatabase();

    boat = await Boat.create({
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

    customer = await Customer.create({
      firstName: 'Stef',
      lastName: 'Korporaal',
      license: true,
      dateOfBirth: new Date('1991-09-25'),
      emailAddress: 'stef@test.nl',
      password: 'password',
      blocked: false,
    });

    await Rental.create({
      boatId: boat.id,
      customerId: customer.id,
      dateStart: new Date('2022-01-01'),
      dateEnd: new Date('2022-01-10'),
      paid: true,
    });
  });

  after(closeDatabase);

  describe('boat.isAvailable', () => {
    it('Responds `{ available: false }` when boat is unavailable', async () => {
      const res = await request(app).get(
        `/boat/${boat.id}/available/2022-01-01/2022-01-10`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ available: false });
    });

    it('Responds `{ available: true }` when boat is available', async () => {
      const res = await request(app).get(
        `/boat/${boat.id}/available/2022-02-01/2022-02-10`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ available: true });
    });
  });

  describe('getAvailableBoatsOverviewData', () => {
    it('Responds empty array when boats are unavailable', async () => {
      const res = await request(app).get(
        '/boat/available/2022-01-01/2022-01-10'
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ boats: [] });
    });

    it('Responds with BoatOverviewData when boats are available', async () => {
      const res = await request(app).get(
        '/boat/available/2022-02-01/2022-02-10'
      );

      expect(res.status).to.equal(200);

      const { boats } = res.body;

      expect(boats.length).to.equal(1);
      expect(boats[0].id).to.equal(boat.id);
    });

    it('Responds with an error on a malformed date', async () => {
      const res = await request(app).get(
        '/boat/available/2022-02-01/2022-02-0'
      );

      expect(res.status).to.equal(400);

      const { error } = res.body;

      expect(error).to.contain('Invalid date');
    });
  });
});
