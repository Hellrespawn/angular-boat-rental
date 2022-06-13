import { FineService } from '../../src/services/fine.service';
import { FineDao } from '../../src/database/fine.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { Fine } from '../../src/model/fine';
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/server';

describe('Test Fine-functionality in backend', () => {
  let fineService: FineService;

  let fineDaoAddFineSpy: SinonSpy<any>;

  function createSpyForFineDaoAddFine(): void {
    fineDaoAddFineSpy = sinon.stub(FineService.prototype, 'addFine');
  }

  beforeEach(async () => {
    createSpyForFineDaoAddFine();
    fineService = new FineService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('The addFine method of the FineDao should be called when correctly requested', async () => {
    await request(app)
      .post('/fines')
      .set('Content-type', 'application/json')
      .send({
        userId: 1,
        amount: 50,
        paid: false,
      })
      .expect(200);
    expect(fineDaoAddFineSpy.callCount).to.equal(1);
  });
});
