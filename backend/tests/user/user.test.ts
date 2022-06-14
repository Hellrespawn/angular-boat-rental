import { UserService } from '../../src/services/user.service';
import { UserDao } from '../../src/database/user.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { User } from '../../src/model/user';
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/server';

describe('Test User-functionality in backend', () => {
  let userService: UserService;

  let testUser: User;

  let userDaoUpdateSpy: SinonSpy<any>;
  let userDaoDeletionSpy: SinonSpy<any>;

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

  beforeEach(async () => {
    await stubUserServiceForReturnAllUsers();
    createSpyForSkipperDaoDeleteSkipper();
    createSpyForUserDaoUpdateUser();
    userService = new UserService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Returns all users when the endpoint /users is called with a get request', async () => {
    const res = await request(app).get('/users').expect(200);
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
