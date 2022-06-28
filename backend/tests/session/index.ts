/* eslint-disable @typescript-eslint/no-explicit-any */
import { SinonSandbox, SinonStub } from 'sinon';
import { SessionDao } from '../../src/database/session.dao';
import { Session } from '../../src/model/session';
import { User } from '../../src/model/user';
import { UserService } from '../../src/services/user.service';

export function stubSessionDao(sandbox: SinonSandbox): {
  getStub: SinonStub<[sessionId: string], Promise<Session | null>>;
  deleteStub: SinonStub<[Session], Promise<boolean>>;
  saveStub: SinonStub<[Session], Promise<void>>;
} {
  const getStub = sandbox.stub(SessionDao.prototype, 'getBySessionId');
  const deleteStub = sandbox.stub(SessionDao.prototype, 'delete');
  const saveStub = sandbox.stub(SessionDao.prototype, 'save');

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

  const stub = sandbox.stub(UserService.prototype, 'getByEmail');

  stub.returns(Promise.resolve(null));
  stub.withArgs(email).returns(Promise.resolve(user));

  return Promise.resolve(user);
}
