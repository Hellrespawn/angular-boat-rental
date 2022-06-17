import { UserService } from '../../src/services/user.service';
import { UserDao } from '../../src/database/user.dao';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { User } from '../../src/model/user';

describe('Test User-functionality in backend', () => {
  let userService: UserService;
  let agent: SuperAgentTest;

  let testUser: User;
  let newUser: User;

  let userDaoAddUserSpy: SinonSpiedInstance<any>;
  let userGetUsersStub: SinonSpiedInstance<any>;
  let userAddUsersStub: SinonSpiedInstance<any>;

  // spy for add users on 'saveNewUser' method
//   function createSpyForUserDaoAddUser(): void {
//     userDaoAddUserSpy = sinon.stub(UserDao.prototype, 'saveNewUser');
//   }

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

  function stubUserDaoAddUsers(): void {
    const stub = sinon.stub(UserDao.prototype, 'saveNewUser');

    userGetUsersStub = stub;
  }
  beforeEach(async () => {
    stubUserServiceForReturnAllUsers();
    // createSpyForUserDaoAddUser();
    stubUserDaoGetUsers();
    stubUserDaoAddUsers();
    
    userService = new UserService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('The createNewUser method of the UserDao should be called when correctly requested by the UserService', async () => {
    await agent
    .post('/users')
    .set('Content-type', 'application/json')
    .send({
    firstName: 'Hans',
    lastName: 'den Otter',
    license: false,
    emailAddress: 'hans@hans.nl',
    password: 'password',
    blocked: false,
    fines: false
    })
    .expect(200);
    expect(userDaoAddUserSpy.callCount).to.equal(1);
  });

  //   it('Fill in wrong entry to see if backend doesnt work', () => {
  //     userService.createNewUser('Hans', 'Kees', false, 'hans@hans.nl', 'password', false);
  //     expect(userDaoAddUserSpy.callCount).to.equal(0);
  //   });
});
