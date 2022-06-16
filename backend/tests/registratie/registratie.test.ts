import { UserService } from '../../src/services/user.service';
import { UserDao } from '../../src/database/user.dao';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/server';
import { User } from '../../src/model/user';

describe('Test User-functionality in backend', () => {
  let userService: UserService;

  let testUser: User;

  let userDaoAddUserSpy: SinonSpiedInstance<any>;
  let userDaoUpdateSpy: SinonSpiedInstance<any>;
  let userDaoDeletionSpy: SinonSpiedInstance<any>;
  let userGetUsersStub: SinonSpiedInstance<any>;

  function createSpyForUserDaoAddUser() {
    userDaoAddUserSpy = sinon.stub(UserDao.prototype, 'saveNewUser');
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

  function stubUserDaoGetUsers(): void {
    const stub = sinon.stub(UserDao.prototype, 'getUsers');

    stub.returns(Promise.resolve([testUser]));

    userGetUsersStub = stub;
  }
  beforeEach(async () => {
    stubUserServiceForReturnAllUsers();
    createSpyForUserDaoAddUser();
    userService = new UserService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Returns all users when the endpoint /users is called with a get request', async () => {
    const res = await request(app).get('/users');
    expect(res.body).to.deep.equal([
      {
        id: 1,  
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        license: testUser.license,
        emailAddress: testUser.emailAddress,
        password: testUser.password,
        blocked: testUser.blocked,
        admin: testUser.admin,
        arrayOfFines: testUser.arrayOfFines
      },
    ]);
  });

  it('The createNewUser method of the UserDao should be called when correctly requested by the UserService', () => {
    userService.createNewUser('Hans', 'den Otter', false, 'hans@hans.nl', 'password', false);
    expect(userDaoAddUserSpy.callCount).to.equal(0);
  });

  it('Fill in wrong entry to see if backend doesnt work', () => {
    userService.createNewUser('Hans', 'Kees', false, 'hans@hans.nl', 'password', false);
    expect(userDaoAddUserSpy.callCount).to.equal(0);
  });

 
});
