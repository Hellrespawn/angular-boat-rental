import { UserService } from '../../src/services/user.service';
import { UserDao, UserModel } from '../../src/database/user.dao';
import { SinonSpy, SinonStub } from 'sinon';
import sinon from 'ts-sinon';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { User } from '../../src/model/user';
import { Session } from '../../src/model/session';
import { SessionService } from '../../src/services/session.service';
import { SessionDao } from '../../src/database/session.dao';

describe('Test User-functionality in backend', () => {
  let userService: UserService;
  let userDao: UserDao;
  let testUser: User;

  let userDaoAddUserSpy: SinonSpy<any>;
  let cookie: string;
  let agent: SuperAgentTest;
  let session: Session;

  //   spy for add users on 'saveNewUser' method
  function createSpyForUserDaoAddUser(): void {
    userDaoAddUserSpy = sinon.stub(UserDao.prototype, 'createNewUser');
    sinon
      .stub(UserService.prototype, 'calculateIfAdmin')
      .returns(Promise.resolve(0));
  }

  async function stubUserServiceForReturnAllUsers(): Promise<void> {
    testUser = new User(
      1,
      'Hans',
      'den Otter',
      false,
      'hans@hans.nl',
      'password',
      false,
      false,
      []
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
        'Hans',
        'den Otter',
        false,
        'hansdenotter@gmail.com',
        'password',
        false,
        true
      )
    );
    createSpyForUserDaoAddUser();
    stubUserServiceForReturnAllUsers();
    stubLoginMethodOfSessionService();
    createStubForSessionDaoGetSession();

    userDao = new UserDao();
    userService = new UserService();

    agent = request.agent(app);
    const res = await agent
      .post('/login')
      .set('Content-type', 'application/json')
      .send({ email: 'hansdenotter@gmail.com', password: 'password' });
    cookie = res.headers['set-cookie'];
  });

  afterEach(() => {
    sinon.restore();
  });

  // integration tests
  it('should pass test for making new User instance ', () => {
    const userFromStub = new User(
      1,
      'Hans',
      'den Otter',
      false,
      'hans@hans.nl',
      'password',
      false,
      false,
      []
    );
    expect(userFromStub).to.deep.equal(testUser);
  });

  it('Test userService.CreateNewUser creates new user', async () => {
    await userService.createNewUser(
      'Hans',
      'den Otter',
      false,
      'hans@hans.nl',
      'password',
      false
    );
    expect(userDaoAddUserSpy.callCount).to.equal(1);
  });

  it('Should invoke userDao.checkEmail function when duplicate email is used', async () => {
    await userService.createNewUser(
      'Hans',
      'den Otter',
      false,
      'hans@hans.nl',
      'password',
      false
    );
    await userDao.checkEmail(testUser.emailAddress);
    expect(userDaoAddUserSpy.callCount).to.equal(1);
  });

  // end to end tests
  it('should not grant access to the /skippers endpoint when not logged in as an admin', async () => {
    await request(app).get('/users').expect(401);
  });

  it('Returns all users when the endpoint /users is called with a get request', async () => {
    const res = await agent.get('/users').set('cookie', cookie);
    expect(res.body).to.deep.equal([
      {
        id: testUser.id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        license: testUser.license,
        emailAddress: testUser.emailAddress,
        password: testUser.password,
        admin: testUser.admin,
        blocked: testUser.blocked,
        arrayOfFines: [],
      },
    ]);
  });
});
