import { FineService } from '../../src/services/fine.service';
import { FineDao } from '../../src/database/fine.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { Fine } from '../../src/model/fine';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { Session } from '../../src/model/session';
import { SessionDao } from '../../src/database/session.dao';
import { User } from '../../src/model/user';
import { SessionService } from '../../src/services/session.service';

describe('Test Fine-functionality in backend', () => {
  let fineService: FineService;

  let fineDaoAddFineSpy: SinonSpy<any>;

  let session: Session;
  let agent: SuperAgentTest;
  let cookie: string;

  function createSpyForFineDaoAddFine(): void {
    fineDaoAddFineSpy = sinon.stub(FineService.prototype, 'addFine');
  }

  function stubLoginMethodOfSessionService(): void {
    const loginMethodStub = sinon.stub(SessionService.prototype, 'login');
    loginMethodStub.returns(Promise.resolve(session));
  }

  function createStubForSessionDaoGetSession(): void {
    const getSessionStub = sinon.stub(SessionDao.prototype, 'getSession');
    getSessionStub.returns(Promise.resolve(session));
  }

  beforeEach(async () => {
    session = Session.createSessionForUser(
      await User.create(
        'Kees',
        'van Ruler',
        false,
        'vanrulerkees@gmail.com',
        'password',
        false,
        true
      )
    );
    stubLoginMethodOfSessionService();
    createStubForSessionDaoGetSession();
    createSpyForFineDaoAddFine();
    fineService = new FineService();
    agent = request.agent(app);
    const res = await agent
      .post('/login')
      .set('Content-type', 'application/json')
      .send({ email: 'vanrulerkees@gmail.com', password: 'password' });
    cookie = res.headers['set-cookie'];
  });

  afterEach(() => {
    sinon.restore();
  });

  it('The addFine method of the FineDao should be called when correctly requested', async () => {
    await request(app)
      .post('/fines')
      .set('Content-type', 'application/json')
      .set('cookie', cookie)
      .send({
        userId: 1,
        amount: 50,
        paid: false,
      })
      .expect(200);
    expect(fineDaoAddFineSpy.callCount).to.equal(1);
  });
});
