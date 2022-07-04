import { type SinonSandbox } from 'sinon';
import { type Session } from '../../src/model/session';
import { type User } from '../../src/model/user';
import { SessionService } from '../../src/services/session.service';

export function stubAuth(sandbox: SinonSandbox, user: User): void {
  const stub = sandbox.stub(SessionService.prototype, 'getBySessionId');

  stub.returns(Promise.resolve({ user } as unknown as Session));
}
