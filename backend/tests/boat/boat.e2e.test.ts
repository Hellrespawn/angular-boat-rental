/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../src/server';
import { expect } from 'chai';
import { type User } from '../../src/model/user';
import { type Boat } from '../../src/model/boat';
import { stubBoatDao } from '../stubs/boat.stub';
import { stubAuth } from '../stubs/auth.stub';
import { TEST_USER } from '../stubs/user.stub';

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
    ({ boatDaoSaveStub } = stubBoatDao(SANDBOX));
    stubAuth(SANDBOX, { ...TEST_USER, admin: true } as User);
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('POST /boats/', () => {
    it('Responds with an error if there is no authenticated admin', async () => {
      const res = await request(app)
        .post(endpoint)
        .field('data', JSON.stringify(NEW_BOAT))
        .field('image', new Blob())
        .expect(401);

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
