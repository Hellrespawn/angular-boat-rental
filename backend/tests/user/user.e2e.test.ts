/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon, { type SinonStub } from 'sinon';
import request from 'supertest';
import { type User } from '../../src/model/user';
import { app } from '../../src/server';
import { stubUserDao, TEST_USER } from '../stubs/user.stub';

const SANDBOX = sinon.createSandbox();

describe('Test User end-to-end', () => {
  let userDaoGetByEmailStub: SinonStub<
    [emailAddress: string],
    Promise<User | null>
  >;
  let saveStub: SinonStub<[User], Promise<void>>;
  beforeEach(async () => {
    ({ userDaoGetByEmailStub, saveStub } = stubUserDao(SANDBOX));
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  it('Registers a new user', async () => {
    const res = await request(app).post('/users/register').send(TEST_USER);

    expect(res.status).to.equal(200);
    expect(saveStub.callCount).to.equal(1);
  });

  it('Rejects user with same email-address', async () => {
    userDaoGetByEmailStub.returns(Promise.resolve(TEST_USER as User));

    const res = await request(app).post('/users/register').send(TEST_USER);

    expect(res.status).to.equal(400);
    expect(saveStub.callCount).to.equal(0);
  });
});
