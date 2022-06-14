import { SkipperService } from '../../src/services/skipper.service';
import { SkipperDao } from '../../src/database/skipper.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { Skipper } from '../../src/model/skipper';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { SessionDao } from '../../src/database/session.dao';
import { Session } from '../../src/model/session';
import { User } from '../../src/model/user';
import { SessionService } from '../../src/services/session.service';

describe('Test Skipper-functionality in backend', () => {
  let skipperService: SkipperService;

  let testSkipper: Skipper;
  const testDate: Date = new Date('2021');

  let skipperDaoAddSkipperSpy: SinonSpy<any>;
  let skipperDaoUpdateSpy: SinonSpy<any>;
  let skipperDaoDeletionSpy: SinonSpy<any>;

  let agent: SuperAgentTest;
  let session: Session;
  let cookie: string;

  function createSpyForSkipperDaoAddSkipper(): void {
    skipperDaoAddSkipperSpy = sinon.stub(
      SkipperDao.prototype,
      'saveNewSkipper'
    );
  }

  function createSpyForSkipperDaoUpdateSkipper(): void {
    skipperDaoUpdateSpy = sinon.stub(
      SkipperDao.prototype,
      'updateLeaveValueInSkipper'
    );
  }

  function createSpyForSkipperDaoDeleteSkipper(): void {
    skipperDaoDeletionSpy = sinon.stub(SkipperDao.prototype, 'deleteSkipper');
  }

  async function stubSkipperServiceForReturnAllSkippers(): Promise<void> {
    testSkipper = new Skipper('Kees', 300, testDate, false, 1);

    const returnAllSkippersStub = sinon.stub(
      SkipperService.prototype,
      'returnAllSkippers'
    );

    returnAllSkippersStub.returns(Promise.resolve([testSkipper]));
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
    stubSkipperServiceForReturnAllSkippers();
    createSpyForSkipperDaoAddSkipper();
    createSpyForSkipperDaoDeleteSkipper();
    createSpyForSkipperDaoUpdateSkipper();
    skipperService = new SkipperService();
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

  //end to end tests:

  it('should not grant access to the /skippers endpoint when not logged in as an admin', async () => {
    await request(app).get('/skippers').expect(401);
  });

  it('Returns all skippers when the endpoint /skippers is called with a get request', async () => {
    const res = await agent.get('/skippers').set('cookie', cookie);
    expect(res.body).to.deep.equal([
      {
        name: testSkipper.name,
        leave: testSkipper.leave,
        pricePerDay: testSkipper.pricePerDay,
        id: 1,
        birthDate: testSkipper.birthDate.toJSON(),
      },
    ]);
  });

  it('The saveNewSkipper method of the SkipperDao should be called when correctly requested by the SkipperService', async () => {
    await agent
      .post('/skippers')
      .set('Content-type', 'application/json')
      .set('cookie', cookie)
      .send({
        name: 'Kees',
        pricePerDay: 123,
        birthDate: new Date('2021').toISOString(),
      })
      .expect(200);
    expect(skipperDaoAddSkipperSpy.callCount).to.equal(1);
  });

  //integration tests:

  it('The updateLeaveValueInSkipper method of the SkipperDao should be called when correctly requested by the SkipperService', () => {
    skipperService.updateLeaveOfSkipper(1, true);
    expect(skipperDaoUpdateSpy.callCount).to.equal(1);
  });

  it('The deleteSkipper method of the SkipperDao should be called when correctly requested by the SkipperService', () => {
    skipperService.deleteSkipper(1);
    expect(skipperDaoDeletionSpy.callCount).to.equal(1);
  });
});
