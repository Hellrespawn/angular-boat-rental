import { UserService } from '../../src/services/user.service';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { User } from '../../src/model/user';
import { assert, expect } from 'chai';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/database/session.dao';

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
      new Date('1991-01-01'),
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

  before(async () => {
    await stubUserService();
    stubSessionDao();
    sessionService = new SessionService();
  });

  after(() => {
    sinon.restore();
  });

  it("Throws an error when the user doesn't exist", async () => {
    try {
      await sessionService.login('fake', 'fake');
      assert.fail('Login with fake date is not supposed to succeed.');
    } catch (error) {
      expect(daoSpy.callCount).to.equal(0);
    }
  });

  it('Creates a session when the user exists', async () => {
    const session = await sessionService.login(user.emailAddress, password);
    expect(daoSpy.callCount).to.equal(1);
  });
});
