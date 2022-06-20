import { UserService } from '../../src/services/user.service';
import { UserDao, UserModel } from '../../src/database/user.dao';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { User } from '../../src/model/user';

describe('Test User-functionality in backend', () => {
  let userService: UserService;

  let testUser: User;
  let newUser: User;

  let userDaoAddUserSpy: SinonSpiedInstance<any>;
  let userGetUsersStub: SinonSpiedInstance<any>;
  let userAddUsersStub: SinonSpiedInstance<any>;

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

  function stubUserDaoGetUsers(): void {
    const stub = sinon.stub(UserDao.prototype, 'getUsers');

    stub.returns(Promise.resolve([testUser]));

    userGetUsersStub = stub;
  }

  //   function stubUserDaoAddUsers(): void {
  //     const stub = sinon.stub(UserDao.prototype, 'saveNewUser');

  //     // stub.returns(Promise.resolve([newUser]));

  //     userAddUsersStub = stub;
  //   }

  beforeEach(async () => {
    createSpyForUserDaoAddUser();
    stubUserServiceForReturnAllUsers();
    // stubUserDaoAddUsers();
    // stubUserDaoGetUsers();

    userService = new UserService();
  });

  afterEach(() => {
    sinon.restore();
  });

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
});
