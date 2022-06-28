import { SinonSandbox, SinonStub } from 'sinon';
import { NewUserData } from '../../src/controller/user.controller';
import { UserDao } from '../../src/database/user.dao';
import { User } from '../../src/model/user';

export const TEST_USER: NewUserData = {
  firstName: 'Stef',
  lastName: 'Korporaal',
  license: false,
  emailAddress: 'test@test.com',
  password: 'test',
};

export function stubUserDao(sandbox: SinonSandbox): {
  countStub: SinonStub<[], Promise<number>>;
  getByEmailStub: SinonStub<[emailAddress: string], Promise<User | null>>;
  saveStub: SinonStub<[User], Promise<void>>;
} {
  const countStub = sandbox.stub(UserDao.prototype, 'count');
  countStub.returns(Promise.resolve(0));

  const getByEmailStub = sandbox.stub(UserDao.prototype, 'getByEmail');
  getByEmailStub.returns(Promise.resolve(null));

  const saveStub = sandbox.stub(UserDao.prototype, 'save');

  return { countStub, getByEmailStub, saveStub };
}
