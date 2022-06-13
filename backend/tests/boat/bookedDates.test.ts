/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { app } from '../../src/server';
import { expect } from 'chai';
import { User } from '../../src/model/user';
import sinon from 'ts-sinon';
import { MotorBoat } from '../../src/model/boat';
import { Rental } from '../../src/model/rental';
import { RentalDao } from '../../src/database/rental.dao';
import { BoatDao } from '../../src/database/boat.dao';

describe('Test /boats/:id/bookedDates', () => {
  const boat = new MotorBoat(
    1,
    'testboat',
    1234,
    1234,
    false,
    false,
    '',
    1234,
    1234,
    1234
  );

  const rental = new Rental(
    1,
    boat,
    {} as unknown as User,
    new Date('2022-01-01'),
    new Date('2022-01-10'),
    false
  );

  function stubBoatDao(): void {
    const getByIdStub = sinon.stub(BoatDao.prototype, 'getById');

    getByIdStub.returns(Promise.resolve(boat));

    const getBoatsStub = sinon.stub(BoatDao.prototype, 'getBoats');

    getBoatsStub.returns(Promise.resolve([boat]));
  }

  function stubRentalDao(): void {
    const stub = sinon.stub(RentalDao.prototype, 'getRentalsByBoatId');

    stub.returns(Promise.resolve([rental]));
  }

  beforeEach(() => {
    stubBoatDao();
    stubRentalDao();
  });

  afterEach(() => {
    sinon.restore();
  });

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
      await request(app)
        .get('/boats/overview/available/2022-02-01/2022-02-0')
        .expect(400)
        .then((res) => {
          const { error } = res.body;
          expect(error).to.contain('Invalid date');
        });
    });
  });
});
