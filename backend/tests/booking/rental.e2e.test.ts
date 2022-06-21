/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import {
  stubBoatDao,
  stubRentalDao,
  stubUserDao,
  TEST_BOAT,
  TEST_RENTAL,
} from '.';
import { User } from '../../src/model/user';
import { SessionService } from '../../src/services/session.service';
import { Session } from '../../src/model/session';
import { app } from '../../src/server';
import { expect } from 'chai';

const SANDBOX = sinon.createSandbox();

function stubAuth(sandbox: SinonSandbox): void {
  const stub = sandbox.stub(SessionService.prototype, 'getSession');

  stub.returns(Promise.resolve({ user: { id: 1 } } as unknown as Session));
}

describe('Test Rental & Booking end-to-end', () => {
  beforeEach(async () => {
    stubRentalDao(SANDBOX, [TEST_RENTAL]);
    stubBoatDao(SANDBOX, TEST_BOAT);
    stubUserDao(SANDBOX, {} as unknown as User);
    stubAuth(SANDBOX);
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('GET /users/rentals/next', () => {
    const endpoint = '/users/rentals/next';
    it('Responds with an error if there is no authenticated user', async () => {
      const res = await request(app).get(endpoint).expect(401);
      expect(res.body).to.have.property('error', 'Invalid credentials');
    });

    it("Responds the user's next rental when authenticated", async () => {
      const res = await request(app)
        .get(endpoint)
        .set('Cookie', 'session=fake')
        .expect(200);
      expect(res.body).to.deep.equal({
        rental: JSON.parse(JSON.stringify(TEST_RENTAL)),
      });
    });
  });

  describe('POST /rentals', () => {
    const endpoint = '/rentals';

    it('Responds with an error if there is no authenticated user', async () => {
      const res = await request(app).post(endpoint).expect(401);
      expect(res.body).to.have.property('error', 'Invalid credentials');
    });

    it('Responds with an error if there is no boat with id', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Cookie', 'session=fake')
        .send({
          boatId: 2,
          dateStart: new Date('2022-01-01').toISOString(),
          dateEnd: new Date('2022-01-10').toISOString(),
        })
        .expect(400);
      expect(res.body).to.have.property('error', 'No boat with id 2.');
    });

    it('Responds with an error if dates are too short', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Cookie', 'session=fake')
        .send({
          boatId: 1,
          dateStart: new Date('2022-02-01').toISOString(),
          dateEnd: new Date('2022-02-02').toISOString(),
        })
        .expect(400);
      expect(res.body).to.have.property(
        'error',
        'Rental period must be at least 3 days!'
      );
    });
  });
});
