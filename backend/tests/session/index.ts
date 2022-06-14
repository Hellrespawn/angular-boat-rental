/* eslint-disable @typescript-eslint/no-explicit-any */
import { SinonSandbox, SinonStub } from 'sinon';
import { SessionDao } from '../../src/database/session.dao';
import { User } from '../../src/model/user';
import { UserService } from '../../src/services/user.service';

export function stubSessionDao(sandbox: SinonSandbox): {
  getStub: SinonStub<any>;
  deleteStub: SinonStub<any>;
  saveStub: SinonStub<any>;
} {
  const getStub = sandbox.stub(SessionDao.prototype, 'getSession');
  const deleteStub = sandbox.stub(SessionDao.prototype, 'deleteSession');
  const saveStub = sandbox.stub(SessionDao.prototype, 'saveSession');

  return { getStub, deleteStub, saveStub };
}

export async function stubUserService(
  sandbox: SinonSandbox,
  email: string,
  password: string
): Promise<User> {
  const user = await User.create(
    'Stef',
    'Korporaal',
    true,
    email,
    password,
    false,
    true
  );

  const stub = sandbox.stub(UserService.prototype, 'getUserByEmail');

  stub.returns(Promise.resolve(null));
  stub.withArgs(email).returns(Promise.resolve(user));

  return Promise.resolve(user);
}
