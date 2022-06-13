/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import { stubSessionDao, stubUserService } from '.';
import { User } from '../../src/model/user';
import { app } from '../../src/server';

const SANDBOX = sinon.createSandbox();

describe('Test Session & Login end-to-end', () => {
  const email = 'test@test.test';
  const password = 'password';

  let user: User;

  beforeEach(async () => {
    user = await stubUserService(SANDBOX, email, password);
    stubSessionDao(SANDBOX);
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  it('Allows access to `/login` without authentication.', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: user.emailAddress, password });

    expect(res.status).to.equal(200);
  });

  it('Correctly sets sessionData', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: user.emailAddress, password });

    expect(res.headers).to.have.property('set-cookie');

    const sessionData = res.body;

    expect(sessionData).to.have.property('firstName', user.firstName);
    expect(sessionData).to.have.property('license', user.license);
    expect(sessionData).to.have.property('admin', user.admin);
  });
});
