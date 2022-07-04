import { type SinonSandbox, type SinonStub } from 'sinon';
import { SessionDao } from '../../src/persistence/session.dao';
import { type Session } from '../../src/model/session';

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
