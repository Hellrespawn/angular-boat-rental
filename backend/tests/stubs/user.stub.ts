import { type SinonSandbox, type SinonStub } from 'sinon';
import { UserDao } from '../../src/persistence/user.dao';
import { type User } from '../../src/model/user';

export const TEST_USER = {
  firstName: 'Stef',
  lastName: 'Korporaal',
  license: false,
  emailAddress: 'test@test.com',
  password: 'abcdef1A',
};

export function stubUserDao(
  sandbox: SinonSandbox,
  defaultValue?: User
): {
  userDaoCountStub: SinonStub<[], Promise<number>>;
  userDaoGetByEmailStub: SinonStub<
    [emailAddress: string],
    Promise<User | null>
  >;
  userDaoGetByIdStub: SinonStub<[id: number], Promise<User | null>>;
  saveStub: SinonStub<[User], Promise<void>>;
} {
  const userDaoCountStub = sandbox.stub(UserDao.prototype, 'count');
  userDaoCountStub.returns(Promise.resolve(0));

  const userDaoGetByEmailStub = sandbox.stub(UserDao.prototype, 'getByEmail');
  userDaoGetByEmailStub.returns(Promise.resolve(null));

  const userDaoGetByIdStub = sandbox.stub(UserDao.prototype, 'getById');

  if (defaultValue) {
    userDaoGetByIdStub.returns(Promise.resolve(defaultValue));
  }

  const saveStub = sandbox.stub(UserDao.prototype, 'save');

  return {
    userDaoCountStub,
    userDaoGetByEmailStub,
    userDaoGetByIdStub,
    saveStub,
  };
}
