import { type SinonSandbox, type SinonStub } from 'sinon';
import { SessionDao } from '../../src/persistence/session.dao';
import { type Session } from '../../src/model/session';

export function stubSessionDao(sandbox: SinonSandbox): {
  sessionDaoGetStub: SinonStub<[sessionId: string], Promise<Session | null>>;
  sessionDaoDeleteStub: SinonStub<[Session], Promise<boolean>>;
  sessionDaoSaveStub: SinonStub<[Session], Promise<void>>;
} {
  const sessionDaoGetStub = sandbox.stub(
    SessionDao.prototype,
    'getBySessionId'
  );
  const sessionDaoDeleteStub = sandbox.stub(SessionDao.prototype, 'delete');
  const sessionDaoSaveStub = sandbox.stub(SessionDao.prototype, 'save');

  return { sessionDaoGetStub, sessionDaoDeleteStub, sessionDaoSaveStub };
}
