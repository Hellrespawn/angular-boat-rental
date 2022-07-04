/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon, { type SinonStub } from 'sinon';
import { type User } from '../../src/model/user';
import { expect } from 'chai';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/persistence/session.dao';
import { Session } from '../../src/model/session';
import { stubUserService } from '.';
import { TEST_USER } from '../stubs/user.stub';
import { stubSessionDao } from '../stubs/session.stub';

const SANDBOX = sinon.createSandbox();

describe('Test SessionService', () => {
  const { emailAddress, password } = TEST_USER;

  let user: User;

  let sessionDaoGetStub: SinonStub<
    [sessionId: string],
    Promise<Session | null>
  >;
  let sessionDaoDeleteStub: SinonStub<[Session], Promise<boolean>>;
  let sessionDaoSaveStub: SinonStub<[Session], Promise<void>>;

  let sessionService: SessionService;

  const expectedError = 'invalid credentials';

  beforeEach(async () => {
    user = await stubUserService(SANDBOX, emailAddress, password);
    ({ sessionDaoDeleteStub, sessionDaoGetStub, sessionDaoSaveStub } =
      stubSessionDao(SANDBOX));
    sessionService = SessionService.getInstance();
    sessionService.clearCache();
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('Tests SessionService.login()', () => {
    it("Throws an error when the user doesn't exist", async () => {
      try {
        await sessionService.login('fake', 'fake');
        expect.fail('Login with non-existent user is not supposed to succeed.');
      } catch (error) {
        expect(sessionDaoSaveStub.callCount).to.equal(0);
        expect((error as Error).message.toLowerCase()).to.include(
          expectedError
        );
      }
    });

    it('Throws an error if password is incorrect', async () => {
      try {
        await sessionService.login(user.emailAddress, 'fake');
        expect.fail(
          'Login with incorrect password is not supposed to succeed.'
        );
      } catch (error) {
        expect(sessionDaoSaveStub.callCount).to.equal(0);
        expect((error as Error).message.toLowerCase()).to.include(
          expectedError
        );
      }
    });

    it('Creates a session when the user exists', async () => {
      const session = await sessionService.login(user.emailAddress, password);
      expect(sessionDaoSaveStub.callCount).to.equal(1);
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
      sessionDaoGetStub.returns(Promise.resolve(testSession));

      const session = await sessionService.getBySessionId('abcd');

      expect(session).to.deep.equal(testSession);
      expect(sessionDaoDeleteStub.callCount).to.equal(0);
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

      sessionDaoGetStub.returns(Promise.resolve(testSession));

      const session = await sessionService.getBySessionId('abcd');

      expect(session).to.equal(null);
      expect(sessionDaoDeleteStub.callCount).to.equal(1);
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

      const stub = SANDBOX.stub(SessionDao.prototype, 'getAll');

      stub.returns(Promise.resolve([validSession, oldSession]));

      await sessionService.clearExpiredSessions();

      expect(sessionDaoDeleteStub.callCount).to.equal(1);
    });
  });
});
