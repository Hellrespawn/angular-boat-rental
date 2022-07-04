import { type SinonSandbox, type SinonStub } from 'sinon';
import { UserDao } from '../../src/database/user.dao';
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
  countStub: SinonStub<[], Promise<number>>;
  getByEmailStub: SinonStub<[emailAddress: string], Promise<User | null>>;
  getByIdStub: SinonStub<[id: number], Promise<User | null>>;
  saveStub: SinonStub<[User], Promise<void>>;
} {
  const countStub = sandbox.stub(UserDao.prototype, 'count');
  countStub.returns(Promise.resolve(0));

  const getByEmailStub = sandbox.stub(UserDao.prototype, 'getByEmail');
  getByEmailStub.returns(Promise.resolve(null));

  const getByIdStub = sandbox.stub(UserDao.prototype, 'getById');

  if (defaultValue) {
    getByIdStub.returns(Promise.resolve(defaultValue));
  }

  const saveStub = sandbox.stub(UserDao.prototype, 'save');

  return { countStub, getByEmailStub, getByIdStub, saveStub };
}
