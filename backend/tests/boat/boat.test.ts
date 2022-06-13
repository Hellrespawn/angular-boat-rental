import { BoatService } from '../../src/services/boat.service';
import { BoatDao } from '../../src/database/boat.dao';
import { SinonSpiedInstance } from 'sinon';
import sinon from 'ts-sinon';
import { Boat, SailBoat } from '../../src/model/boat';
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../src/server';

describe('Test Boat-functionality in backend', () => {
  let boatService: BoatService;

  let testBoat: Boat;

  let boatDaoAddBoatSpy: SinonSpiedInstance<any>;
  let boatDaoUpdateSpy: SinonSpiedInstance<any>;
  let boatDaoDeletionSpy: SinonSpiedInstance<any>;

  function createSpyForBoatDaoAddBoat(): void {
    boatDaoAddBoatSpy = sinon.stub(BoatDao.prototype, 'saveNewBoat');
  }

  function createSpyForBoatDaoUpdateMaintenance(): void {
    boatDaoUpdateSpy = sinon.stub(
      BoatDao.prototype,
      'updateMaintenanceValueInBoat'
    );
  }

  function createSpyForBoatDaoDeletion(): void {
    boatDaoDeletionSpy = sinon.stub(BoatDao.prototype, 'deleteBoat');
  }

  async function stubBoatServiceForGetBoats(): Promise<void> {
    testBoat = new SailBoat(
      1,
      'De Test Boot',
      123,
      250,
      false,
      false,
      '',
      25,
      10,
      40
    );

    const returnAllBoatsStub = sinon.stub(
      BoatService.prototype,
      'returnAllBoats'
    );

    returnAllBoatsStub.returns(Promise.resolve([testBoat]));
  }

  beforeEach(async () => {
    stubBoatServiceForGetBoats();
    createSpyForBoatDaoAddBoat();
    createSpyForBoatDaoDeletion();
    createSpyForBoatDaoUpdateMaintenance();
    boatService = new BoatService();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Returns all Boats when the endpoint /boats is called with a get request', async () => {
    const res = await request(app).get('/boats');
    expect(res.body).to.deep.equal({
      boats: [
        {
          id: 1,
          name: 'De Test Boot',
          registrationNumber: 123,
          pricePerDay: 250,
          skipperRequired: false,
          maintenance: false,
          imageRoute: '',
          lengthInM: 25,
          maxOccupants: 10,
          boatType: 'sail',
          sailAreaInM2: 40,
        },
      ],
    });
  });

  it('The saveNewBoat method of the BoatDao should be called when correctly requested by the BoatService via the endpoint "/boats"', async () => {
    await request(app)
      .post('/boats')
      .set('Content-type', 'application/json')
      .send({
        name: 'De Test Boot',
        registrationNumber: 123,
        pricePerDay: 250,
        skipperRequired: false,
        maintenance: false,
        imageRoute: '',
        lengthInM: 25,
        maxOccupants: 10,
        boatType: 'sail',
        maxSpeedInKmH: undefined,
        sailAreaInM2: 40,
      })
      .expect(200);
    expect(boatDaoAddBoatSpy.callCount).to.equal(1);
  });

  it('The updateMaintenanceValue method of the BoatDao should be called when correctly requested by the BoatService', () => {
    boatService.updateMaintenanceOfBoat(1, true);
    expect(boatDaoUpdateSpy.callCount).to.equal(1);
  });

  it('The deleteBoat method of the BoatDao should be called when correctly requested by the BoatService', () => {
    boatService.deleteBoat(1);
    expect(boatDaoDeletionSpy.callCount).to.equal(1);
  });
});
