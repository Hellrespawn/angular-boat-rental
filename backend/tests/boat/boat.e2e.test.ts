/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../src/server';
import { expect } from 'chai';
import { stubAuth, stubBoatDao, stubUserDao, TEST_USER } from '..';
import { User } from '../../src/model/user';
import { Boat } from '../../src/model/boat';

const SANDBOX = sinon.createSandbox();

const NEW_BOAT = {
  registrationNumber: 1234,
  pricePerDay: 1234,
  imageRoute: '',
  lengthInM: 1234,
  maxPassengers: 1234,
  boatType: 'motor',
  maxSpeedInKmH: 1234,
};

describe('Test Boat end-to-end', () => {
  const endpoint = '/boats';

  let boatDaoSaveStub: sinon.SinonStub<[newBoat: Boat], Promise<void>>;

  beforeEach(async () => {
    ({ boatDaoSaveStub } = stubBoatDao(SANDBOX));
    stubAuth(SANDBOX, { ...TEST_USER, admin: true } as User);
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('POST /boats/', () => {
    it('Responds with an error if there is no authenticated admin', async () => {
      const res = await request(app).post(endpoint).send(NEW_BOAT).expect(401);

      expect(res.body).to.have.property('error');
      expect(res.body.error).to.contain('Invalid credentials');
    });

    it('Adds new boat if current user is an admin', async () => {
      await request(app)
        .post(endpoint)
        .set('Cookie', 'session=fake')
        .send(NEW_BOAT)
        .expect(200);

      expect(boatDaoSaveStub.callCount).to.equal(1);
    });

    it('Adds new boat if current user is an admin', async () => {
      await request(app)
        .post(endpoint)
        .set('Cookie', 'session=fake')
        .send(NEW_BOAT)
        .expect(200);

      expect(boatDaoSaveStub.callCount).to.equal(1);
    });
  });
});
