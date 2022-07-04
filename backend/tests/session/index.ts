/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SinonSandbox } from 'sinon';
import { User } from '../../src/model/user';
import { UserService } from '../../src/services/user.service';

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
