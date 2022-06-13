import { SkipperService } from '../../src/services/skipper.service';
import { SkipperDao } from '../../src/database/skipper.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { Skipper } from '../../src/model/skipper';
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/server';

describe('Test Skipper-functionality in backend', () => {
  let skipperService: SkipperService;

  let testSkipper: Skipper;
  const testDate: Date = new Date();

  let skipperDaoAddSkipperSpy: SinonSpy<any>;
  let skipperDaoUpdateSpy: SinonSpy<any>;
  let skipperDaoDeletionSpy: SinonSpy<any>;

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

  beforeEach(async () => {
    stubSkipperServiceForReturnAllSkippers();
    createSpyForSkipperDaoAddSkipper();
    createSpyForSkipperDaoDeleteSkipper();
    createSpyForSkipperDaoUpdateSkipper();
    skipperService = new SkipperService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Returns all skippers when the endpoint /skippers is called with a get request', async () => {
    const res = await request(app).get('/skippers');
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
    await request(app)
      .post('/skippers')
      .set('Content-type', 'application/json')
      .send({
        name: 'Kees',
        pricePerDay: '123',
        birthDate: new Date(),
      })
      .expect(200);
    expect(skipperDaoAddSkipperSpy.callCount).to.equal(1);
  });

  it('The updateLeaveValueInSkipper method of the SkipperDao should be called when correctly requested by the SkipperService', () => {
    skipperService.updateLeaveOfSkipper(1, true);
    expect(skipperDaoUpdateSpy.callCount).to.equal(1);
  });

  it('The deleteSkipper method of the SkipperDao should be called when correctly requested by the SkipperService', () => {
    skipperService.deleteSkipper(1);
    expect(skipperDaoDeletionSpy.callCount).to.equal(1);
  });
});
