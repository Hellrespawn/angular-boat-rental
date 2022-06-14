/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import { stubSessionDao, stubUserService } from '.';
import { User } from '../../src/model/user';
import { app } from '../../src/server';

const SANDBOX = sinon.createSandbox();

function getSessionIdFromCookie(cookies: [string]): string {
  const cookie = cookies.join(';');
  const pair = cookie
    .split(';')
    .map((s) => s.split('='))
    .find(([key, _]) => key === 'session');

  if (!pair) {
    throw new Error('Cookie not set!');
  }

  return pair[1];
}

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

  it('Allows access to `/login` with and without authentication.', async () => {
    const agent = request.agent(app);

    // Without auth
    const res1 = await agent
      .post('/login')
      .send({ email: user.emailAddress, password });

    expect(res1.status).to.equal(200);
    const cookie1 = getSessionIdFromCookie(res1.headers['set-cookie']);

    // With auth
    const res2 = await agent
      .post('/login')
      .send({ email: user.emailAddress, password });

    expect(res2.status).to.equal(200);
    const cookie2 = getSessionIdFromCookie(res2.headers['set-cookie']);

    expect(cookie1).to.not.equal(cookie2);
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
