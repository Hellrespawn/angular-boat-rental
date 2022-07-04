/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import sinon, { SinonStub } from 'sinon';
import { app } from '../../src/server';
import { expect } from 'chai';
import { type User } from '../../src/model/user';
import { type Boat } from '../../src/model/boat';
import { stubBoatDao } from '../stubs/boat.stub';
import { stubAuth } from '../stubs/auth.stub';
import { TEST_USER } from '../stubs/user.stub';
import { stubImageDao } from '../stubs/image.stub';
import { readFile } from 'fs/promises';
import path from 'path';

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

const IMAGE_PATH = path.join(__dirname, '..', '..', 'doc', 'test.jpg');

describe.only('Test Boat end-to-end', () => {
  const endpoint = '/boats';

  let boatDaoSaveStub: SinonStub<[newBoat: Boat], Promise<void>>;
  let imageDaoSaveStub: SinonStub<
    [buffer: Buffer, filename: string],
    Promise<boolean>
  >;

  beforeEach(async () => {
    ({ boatDaoSaveStub } = stubBoatDao(SANDBOX));
    ({ imageDaoSaveStub } = stubImageDao(SANDBOX));
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
        .attach('image', IMAGE_PATH)
        .expect(401);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.contain('Invalid credentials');

      expect(boatDaoSaveStub.callCount).to.equal(0);
      expect(imageDaoSaveStub.callCount).to.equal(0);
    });

    it('Adds new boat if current user is an admin', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Cookie', 'session=fake')
        .field('data', JSON.stringify(NEW_BOAT))
        .attach('image', IMAGE_PATH);

      expect(res.status).to.equal(200);
      expect(boatDaoSaveStub.callCount).to.equal(1);
      expect(imageDaoSaveStub.callCount).to.equal(1);
    });
  });
});
