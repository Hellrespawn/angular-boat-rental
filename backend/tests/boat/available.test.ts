import request from 'supertest';
import { Boat } from '../../src/model/boat.model';
import { app } from '../../src/server';
import { expect } from 'chai';
import { initDatabase } from '../mocha-setup';
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
    });

    await Rental.create({
      boatId: boat.id,
      customerId: customer.id,
      date_start: new Date('2022-01-01'),
      date_end: new Date('2022-01-10'),
      paid: true,
    });
  });

  describe('boat.isAvailable', () => {
    it('Responds unavailable', async () => {
      const res = await request(app).get(
        `/boat/${boat.id}/available/2022-01-01/2022-01-10`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ available: false });
    });

    it('Responds available', async () => {
      const res = await request(app).get(
        `/boat/${boat.id}/available/2022-02-01/2022-02-10`
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ available: true });
    });
  });
});
