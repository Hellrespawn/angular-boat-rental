import { UserService } from '../../src/services/user.service';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { User } from '../../src/model/user';
import { assert, expect } from 'chai';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/database/session.dao';
import request from 'supertest';
import { app } from '../../src/server';

describe('Test Session', () => {
  const password = 'password';

  let user: User;

  let daoSpy: SinonSpiedInstance<any>;

  let sessionService: SessionService;

  async function stubUserService(): Promise<void> {
    user = await User.createWithPlaintextPassword(
      'Stef',
      'Korporaal',
      true,
      'test@test.test',
      password,
      false,
      true
    );

    const stub = sinon.stub(UserService.prototype, 'getUser');

    stub.returns(Promise.resolve(null));
    stub.withArgs('test@test.test').returns(Promise.resolve(user));
  }

  function stubSessionDao(): void {
    const stub = sinon.stub(SessionDao.prototype, 'saveSession');

    daoSpy = stub;
  }

  beforeEach(async () => {
    await stubUserService();
    stubSessionDao();
    sessionService = new SessionService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Throws an error when the user doesn't exist", async () => {
    try {
      await sessionService.login('fake', 'fake');
    } catch (error) {
      expect(daoSpy.callCount).to.equal(0);
      return;
    }

    assert.fail('Login with non-existent user is not supposed to succeed.');
  });

  it('Throws an error password is incorrect', async () => {
    try {
      await sessionService.login(user.emailAddress, 'fake');
    } catch (error) {
      expect(daoSpy.callCount).to.equal(0);
      return;
    }

    assert.fail('Login with incorrect password is not supposed to succeed.');
  });

  it('Creates a session when the user exists', async () => {
    const session = await sessionService.login(user.emailAddress, password);
    expect(daoSpy.callCount).to.equal(1);
    expect(session.user).to.deep.equal(user);
  });

  it('Throws the same error for incorrect email and incorrect password.', async () => {
    try {
      await sessionService.login('fake', 'fake');
    } catch (error1) {
      expect(daoSpy.callCount).to.equal(0);

      try {
        await sessionService.login(user.emailAddress, 'fake');
      } catch (error2) {
        expect(daoSpy.callCount).to.equal(0);
        expect(error1).to.deep.equal(error2);
        return;
      }

      assert.fail('Login with incorrect password is not supposed to succeed.');
    }

    assert.fail('Login with non-existent user is not supposed to succeed.');
  });

  it('Always allows access to /login', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: user.emailAddress, password });

    expect(res.status).to.equal(200);
  });

  it('Correctly sets a cookie', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: user.emailAddress, password });

    expect(res.headers).to.have.property('set-cookie');

    const cookieString = res.headers['set-cookie'][0] as string;

    const [_, value] = cookieString
      .split(';')
      .map((s) => s.split('='))
      .find(([key, _]) => key === 'session')!;

    const sessionData = JSON.parse(decodeURIComponent(value));

    expect(sessionData.firstName === user.firstName);
    expect(sessionData.license === user.license);
    expect(sessionData.admin === user.admin);
  });
});
