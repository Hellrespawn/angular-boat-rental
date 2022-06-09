import { UserService } from '../../src/services/user.service';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { User } from '../../src/model/user';
import { assert, expect } from 'chai';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/database/session.dao';
import request from 'supertest';
import { app } from '../../src/server';
import { Session } from '../../src/model/session';

describe('Test Session', () => {
  const password = 'password';

  let user: User;

  let saveStub: SinonSpiedInstance<any>;
  let deleteStub: SinonSpiedInstance<any>;

  let sessionService: SessionService;

  const expectedError = 'invalid credentials';

  async function stubUserService(): Promise<void> {
    user = await User.create(
      'Stef',
      'Korporaal',
      true,
      'test@test.test',
      password,
      false,
      true
    );

    const stub = sinon.stub(UserService.prototype, 'getUserByEmail');

    stub.returns(Promise.resolve(null));
    stub.withArgs('test@test.test').returns(Promise.resolve(user));
  }

  function stubSessionDao(): void {
    saveStub = sinon.stub(SessionDao.prototype, 'saveSession');
    deleteStub = sinon.stub(SessionDao.prototype, 'deleteSession');
  }

  beforeEach(async () => {
    await stubUserService();
    stubSessionDao();
    sessionService = new SessionService();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Tests the login process', () => {
    it("Throws an error when the user doesn't exist", async () => {
      try {
        await sessionService.login('fake', 'fake');
      } catch (error) {
        expect(saveStub.callCount).to.equal(0);
        expect((error as Error).message.toLowerCase()).to.include(
          expectedError
        );
        return;
      }

      assert.fail('Login with non-existent user is not supposed to succeed.');
    });

    it('Throws an error password is incorrect', async () => {
      try {
        await sessionService.login(user.emailAddress, 'fake');
      } catch (error) {
        expect(saveStub.callCount).to.equal(0);
        expect((error as Error).message.toLowerCase()).to.include(
          expectedError
        );
        return;
      }

      assert.fail('Login with incorrect password is not supposed to succeed.');
    });

    it('Creates a session when the user exists', async () => {
      const session = await sessionService.login(user.emailAddress, password);
      expect(saveStub.callCount).to.equal(1);
      expect(session.user).to.deep.equal(user);
    });
  });

  describe('Test session expiration', () => {
    function testSessionExpiration(date: Date, expected: boolean): void {
      expect(new Session(-1, '', user, date).isExpired()).to.equal(expected);
    }

    it('Removes an expired session', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(
        expiredDate.getDate() - SessionService.MaxSessionAge - 1
      );

      const validSession = new Session(-1, '', user, new Date());
      const oldSession = new Session(-1, '', user, expiredDate);

      const stub = sinon.stub(SessionDao.prototype, 'getAllSessions');

      stub.returns(Promise.resolve([validSession, oldSession]));

      await sessionService.clearExpiredSessions();

      expect(deleteStub.callCount).to.equal(1);
    });

    it('Current date is not expired', () => {
      testSessionExpiration(new Date(), false);
    });

    it('MaxSessionAge + 10 is expired', () => {
      const expired = new Date();
      expired.setDate(expired.getDate() - SessionService.MaxSessionAge - 10);

      testSessionExpiration(expired, true);
    });

    it('Exactly MaxSessionAge is expired', () => {
      const exactlyExpired = new Date();
      exactlyExpired.setDate(
        exactlyExpired.getDate() - SessionService.MaxSessionAge
      );

      testSessionExpiration(exactlyExpired, true);
    });

    it('MaxSessionAge - 1 is not expired', () => {
      const exactlyValid = new Date();
      exactlyValid.setDate(
        exactlyValid.getDate() - SessionService.MaxSessionAge + 1
      );

      testSessionExpiration(exactlyValid, false);
    });
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
