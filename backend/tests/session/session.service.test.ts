/* eslint-disable @typescript-eslint/no-explicit-any */
import { SinonStub } from 'sinon';
import sinon from 'ts-sinon';
import { User } from '../../src/model/user';
import { assert, expect } from 'chai';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/database/session.dao';
import { Session } from '../../src/model/session';
import { stubSessionDao, stubUserService } from '.';

const SANDBOX = sinon.createSandbox();

describe('Test SessionService', () => {
  const email = 'test@test.test';
  const password = 'password';

  let user: User;

  let deleteStub: SinonStub<any>;
  let getStub: SinonStub<any>;
  let saveStub: SinonStub<any>;

  let sessionService: SessionService;

  const expectedError = 'invalid credentials';

  beforeEach(async () => {
    user = await stubUserService(SANDBOX, email, password);
    ({ deleteStub, getStub, saveStub } = stubSessionDao(SANDBOX));
    sessionService = new SessionService();
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('Tests SessionService.login()', () => {
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

    it('Throws an error if password is incorrect', async () => {
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

  describe('Test SessionService.getSession()', () => {
    it("Returns the session if it's not expired", async () => {
      const testSession = new Session(
        1,
        'abcd',
        {} as unknown as User,
        new Date()
      );
      getStub.returns(testSession);

      const session = await sessionService.getSession('abcd');

      expect(session).to.deep.equal(testSession);
      expect(deleteStub.callCount).to.equal(0);
    });

    it('Deletes the session if expired', async () => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - 30);
      const testSession = new Session(
        1,
        'abcd',
        {} as unknown as User,
        createdAt
      );
      getStub.returns(testSession);

      const session = await sessionService.getSession('abcd');

      expect(session).to.equal(null);
      expect(deleteStub.callCount).to.equal(1);
    });
  });

  describe('Test SessionService.clearExpiredSessions()', () => {
    it('Removes an expired session', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(
        expiredDate.getDate() - SessionService.MaxSessionAge - 1
      );

      const validSession = new Session(-1, '', user, new Date());
      const oldSession = new Session(-1, '', user, expiredDate);

      const stub = SANDBOX.stub(SessionDao.prototype, 'getAllSessions');

      stub.returns(Promise.resolve([validSession, oldSession]));

      await sessionService.clearExpiredSessions();

      expect(deleteStub.callCount).to.equal(1);
    });
  });
});
