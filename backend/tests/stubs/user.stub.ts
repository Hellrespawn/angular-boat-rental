import { type SinonSandbox, type SinonStub } from 'sinon';
import { UserDao } from '../../src/persistence/user.dao';
import { type User } from '../../src/model/user';

export const TEST_USER = {
  id: 1,
  firstName: 'Stef',
  lastName: 'Korporaal',
  license: false,
  emailAddress: 'test@test.com',
  password: 'abcdef1A',
  blocked: false,
  admin: false,
};

export function stubUserDao(
  sandbox: SinonSandbox,
  defaultValue?: User
): {
  userDaoCountStub: SinonStub<[], Promise<number>>;
  userDaoGetAllStub: SinonStub<[], Promise<User[]>>;
  userDaoGetByEmailStub: SinonStub<
    [emailAddress: string],
    Promise<User | null>
  >;
  userDaoGetByIdStub: SinonStub<[id: number], Promise<User | null>>;
  userDaoSaveStub: SinonStub<[User], Promise<void>>;
} {
  const userDaoCountStub = sandbox.stub(UserDao.prototype, 'count');
  userDaoCountStub.returns(Promise.resolve(0));

  const userDaoGetAllStub = sandbox.stub(UserDao.prototype, 'getAll');
  userDaoGetAllStub.returns(Promise.resolve([]));

  const userDaoGetByEmailStub = sandbox.stub(UserDao.prototype, 'getByEmail');
  userDaoGetByEmailStub.returns(Promise.resolve(null));

  const userDaoGetByIdStub = sandbox.stub(UserDao.prototype, 'getById');
  userDaoGetByEmailStub.returns(Promise.resolve(null));

  if (defaultValue) {
    userDaoGetAllStub.returns(Promise.resolve([defaultValue]));
    userDaoGetByIdStub.returns(Promise.resolve(defaultValue));
    userDaoGetByEmailStub.returns(Promise.resolve(defaultValue));
  }

  const userDaoSaveStub = sandbox.stub(UserDao.prototype, 'save');

  return {
    userDaoCountStub,
    userDaoGetAllStub,
    userDaoGetByEmailStub,
    userDaoGetByIdStub,
    userDaoSaveStub,
    // TODO stub updateBlocked
  };
}
