/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon, { type SinonStub } from 'sinon';
import { expect } from 'chai';
import { type User } from '../../src/model/user';
import { UserService } from '../../src/services/user.service';
import { stubUserDao, TEST_USER } from '../stubs/user.stub';

const SANDBOX = sinon.createSandbox();

describe('Test UserService', () => {
  let countStub: SinonStub<[], Promise<number>>;
  let getByEmailStub: SinonStub<[emailAddress: string], Promise<User | null>>;
  let saveStub: SinonStub<[User], Promise<void>>;

  let service: UserService;

  beforeEach(async () => {
    service = UserService.getInstance();

    ({ countStub, getByEmailStub, saveStub } = stubUserDao(SANDBOX));
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('Test UserService.register', () => {
    it('Registers a new user', async () => {
      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      await service.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      expect(saveStub.callCount).to.equal(1);
    });

    it('Rejects user with same email-address', async () => {
      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      getByEmailStub.returns(Promise.resolve({ emailAddress } as User));

      try {
        await service.register(
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

      expect(saveStub.callCount).to.equal(0);
    });

    it('Gives first user admin privileges', async () => {
      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      await service.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      expect(saveStub.callCount).to.equal(1);

      const user = saveStub.getCall(0).args[0];

      expect(user.admin).to.be.true;
    });

    it('Does not give following users admin privileges', async () => {
      countStub.returns(Promise.resolve(1));

      const { firstName, lastName, license, emailAddress, password } =
        TEST_USER;

      await service.register(
        firstName,
        lastName,
        license,
        emailAddress,
        password
      );

      expect(saveStub.callCount).to.equal(1);

      const user = saveStub.getCall(0).args[0];

      expect(user.admin).to.be.false;
    });
  });
});
