/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon, { type SinonStub } from 'sinon';
import { expect } from 'chai';
import { type User } from '../../src/model/user';
import { UserService } from '../../src/services/user.service';
import { stubUserDao, TEST_USER } from '../stubs/user.stub';
import { stubSessionDao } from '../stubs/session.stub';
import { Session } from '../../src/model/session';
import { SessionService } from '../../src/services/session.service';

const SANDBOX = sinon.createSandbox();

describe('Test UserService', () => {
  let userDaoCountStub: SinonStub<[], Promise<number>>;
  let userDaoGetAllStub: SinonStub<[], Promise<User[]>>;
  let userDaoGetByEmailStub: SinonStub<
    [emailAddress: string],
    Promise<User | null>
  >;
  let userDaoSaveStub: SinonStub<[User], Promise<void>>;

  let userService: UserService;

  beforeEach(async () => {
    userService = UserService.getInstance();

    ({
      userDaoGetAllStub,
      userDaoCountStub,
      userDaoGetByEmailStub,
      userDaoSaveStub,
    } = stubUserDao(SANDBOX));
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('Test UserService.register', () => {
    it('Registers a new user', async () => {
      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      await userService.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      expect(userDaoSaveStub.callCount).to.equal(1);
    });

    it('Rejects user with same email-address', async () => {
      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      userDaoGetByEmailStub.returns(Promise.resolve({ emailAddress } as User));

      try {
        await userService.register(
          firstName,
          lastName,
          license,
          emailAddress,
          password
        );

        expect.fail('Expected user with same email-address to fail');
      } catch (error) {
        expect((error as Error).message).to.contain(
          'There is already a user with this e-mail address!'
        );
      }

      expect(userDaoSaveStub.callCount).to.equal(0);
    });

    it('Gives first user admin privileges', async () => {
      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      await userService.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      expect(userDaoSaveStub.callCount).to.equal(1);

      const user = userDaoSaveStub.getCall(0).args[0];

      expect(user.admin).to.be.true;
    });

    it('Does not give following users admin privileges', async () => {
      userDaoCountStub.returns(Promise.resolve(1));

      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      await userService.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      expect(userDaoSaveStub.callCount).to.equal(1);

      const user = userDaoSaveStub.getCall(0).args[0];

      expect(user.admin).to.be.false;
    });
  });

  describe('Test UserService.getOverviewData', () => {
    it('Correctly transforms users', async () => {
      userDaoGetAllStub.returns(Promise.resolve([TEST_USER as User]));

      const expected = [
        {
          id: 1,
          emailAddress: 'test@test.com',
          firstName: 'Stef',
          lastName: 'Korporaal',
          license: false,
          blocked: false,
          admin: false,
        },
      ];

      const actual = await userService.getOverviewData();

      console.log(actual);

      expect(actual).to.deep.equal(expected);
    });

    it('Does not include password', async () => {
      userDaoGetAllStub.returns(Promise.resolve([TEST_USER as User]));

      const actual = await userService.getOverviewData();

      expect(actual).does.not.have.property('password');
    });
  });

  describe('Test UserService.toggleBlocked', () => {
    let sessionDaoDeleteStub: SinonStub<[Session], Promise<boolean>>;
    let sessionService: SessionService;

    beforeEach(() => {
      ({ sessionDaoDeleteStub } = stubSessionDao(SANDBOX));
      sessionService = SessionService.getInstance();
    });

    it('Deletes sessions when a user is blocked.', async () => {
      const session = await sessionService.login(
        TEST_USER.emailAddress,
        TEST_USER.password
      );

      expect(sessionService.getBySessionId(session.sessionId)).to.deep.equal(
        session
      );

      await userService.toggleBlocked(TEST_USER.id);

      expect(sessionService.getBySessionId(session.sessionId)).to.equal(null);
    });
  });
});
