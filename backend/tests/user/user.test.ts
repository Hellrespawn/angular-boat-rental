import { UserService } from '../../src/services/user.service';
import { UserDao } from '../../src/database/user.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { User } from '../../src/model/user';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { Session } from '../../src/model/session';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/database/session.dao';

describe('Test User-functionality in backend', () => {
  let userService: UserService;

  let testUser: User;

  let userDaoUpdateSpy: SinonSpy<any>;
  let userDaoDeletionSpy: SinonSpy<any>;

  let agent: SuperAgentTest;
  let session: Session;
  let cookie: string;

  function createSpyForUserDaoUpdateUser(): void {
    userDaoUpdateSpy = sinon.stub(
      UserDao.prototype,
      'updateBlockedValueOfUser'
    );
  }

  function createSpyForSkipperDaoDeleteSkipper(): void {
    userDaoDeletionSpy = sinon.stub(UserDao.prototype, 'deleteUser');
  }

  async function stubUserServiceForReturnAllUsers(): Promise<void> {
    testUser = await User.create(
      'Kees',
      'van Ruler',
      true,
      'vanrulerkees@gmail.com',
      'password',
      false,
      false
    );

    const returnAllUsersStub = sinon.stub(
      UserService.prototype,
      'returnAllUsers'
    );

    returnAllUsersStub.returns(Promise.resolve([testUser]));
  }

  function stubLoginMethodOfSessionService(): void {
    const loginMethodStub = sinon.stub(SessionService.prototype, 'login');
    loginMethodStub.returns(Promise.resolve(session));
  }

  function createStubForSessionDaoGetSession(): void {
    const getSessionStub = sinon.stub(SessionDao.prototype, 'getSession');
    getSessionStub.returns(Promise.resolve(session));
  }

  beforeEach(async () => {
    session = Session.createSessionForUser(
      await User.create(
        'Kees',
        'van Ruler',
        false,
        'vanrulerkees@gmail.com',
        'password',
        false,
        true
      )
    );
    stubLoginMethodOfSessionService();
    createStubForSessionDaoGetSession();
    await stubUserServiceForReturnAllUsers();
    createSpyForSkipperDaoDeleteSkipper();
    createSpyForUserDaoUpdateUser();
    userService = new UserService();
    agent = request.agent(app);
    const res = await agent
      .post('/login')
      .set('Content-type', 'application/json')
      .send({ email: 'vanrulerkees@gmail.com', password: 'password' });
    cookie = res.headers['set-cookie'];
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Returns all users when the endpoint /users is called with a get request', async () => {
    const res = await agent.get('/users').set('cookie', cookie).expect(200);
    expect(res.body).to.deep.equal([
      {
        id: testUser.id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        blocked: false,
        license: testUser.license,
        emailAddress: testUser.emailAddress,
        admin: testUser.admin,
        arrayOfFines: [],
        password: testUser.password,
      },
    ]);
  });

  it('The updateBlockedValueInUser method of the UserDao should be called when correctly requested by the UserService', () => {
    userService.updateBlockedValueOfUser(1, true);
    expect(userDaoUpdateSpy.callCount).to.equal(1);
  });

  it('The deleteUser method of the UserDao should be called when correctly requested by the UserService', () => {
    userService.deleteUser(1);
    expect(userDaoDeletionSpy.callCount).to.equal(1);
  });
});
