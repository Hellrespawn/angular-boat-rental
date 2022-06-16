import { BoatService } from '../../src/services/boat.service';
import { BoatDao } from '../../src/database/boat.dao';
import { SinonSpy } from 'sinon';
import sinon from 'ts-sinon';
import { Boat, SailBoat } from '../../src/model/boat';
import { expect } from 'chai';
import request, { SuperAgentTest } from 'supertest';
import { app } from '../../src/server';
import { SessionDao } from '../../src/database/session.dao';
import { Session } from '../../src/model/session';
import { User } from '../../src/model/user';
import { SessionService } from '../../src/services/session.service';
import { assert } from 'console';
import { ServerError } from '../../src/util/error';

describe('Test Boat-functionality in backend', () => {
  let boatService: BoatService;

  let testBoat: Boat;

  let boatDaoAddBoatSpy: SinonSpy<any>;
  let boatDaoUpdateSpy: SinonSpy<any>;
  let boatDaoDeletionSpy: SinonSpy<any>;

  let session: Session;
  let agent: SuperAgentTest;
  let cookie: string;

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
    stubBoatServiceForGetBoats();
    createSpyForBoatDaoAddBoat();
    createSpyForBoatDaoDeletion();
    createSpyForBoatDaoUpdateMaintenance();
    boatService = new BoatService();
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

  it('should not grant access to the /boats endpoint when not logged in as an admin', async () => {
    await request(app).get('/boats').expect(401);
  });

  it('Returns all Boats when the endpoint /boats is called with a get request', async () => {
    const res = await agent.get('/boats').set('cookie', cookie);
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
    await agent
      .post('/boats')
      .set('Content-type', 'application/json')
      .set('cookie', cookie)
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

  //integration tests:

  it('The updateMaintenanceValue method of the BoatDao should be called when correctly requested by the BoatService', () => {
    boatService.updateMaintenanceOfBoat(1, true);
    expect(boatDaoUpdateSpy.callCount).to.equal(1);
  });

  it('The deleteBoat method of the BoatDao should be called when correctly requested by the BoatService', () => {
    boatService.deleteBoat(1);
    expect(boatDaoDeletionSpy.callCount).to.equal(1);
  });

  //unit tests:

  it('should throw an error when trying to make a Boat when a negative registrationNumber is entered', () => {
    expect(() =>
      Boat.createBoat('test', -1, 250, true, '', 25, 10, 'motor', 100)
    ).to.throw('invalid registration number');
  });

  it('should throw an error when trying to make a Boat when a registrationNumber of zero is entered', () => {
    expect(() =>
      Boat.createBoat('test', 0, 250, true, '', 25, 10, 'motor', 100)
    ).to.throw('invalid registration number');
  });

  it('should throw an error when trying to make a Boat when a negative price is entered', () => {
    expect(() =>
      Boat.createBoat('test', 123, -1, true, '', 25, 10, 'motor', 100)
    ).to.throw('invalid price per day');
  });

  it('should throw an error when trying to make a Boat when a price of zero is entered', () => {
    expect(() =>
      Boat.createBoat('test', 123, 0, true, '', 25, 10, 'motor', 100)
    ).to.throw('invalid price per day');
  });

  it('should throw an error when trying to make a Boat when a negative length is entered', () => {
    expect(() =>
      Boat.createBoat('test', 123, 250, true, '', -1, 10, 'motor', 100)
    ).to.throw('invalid length');
  });

  it('should throw an error when trying to make a Boat when a length of zero is entered', () => {
    expect(() =>
      Boat.createBoat('test', 123, 250, true, '', 0, 10, 'motor', 100)
    ).to.throw('invalid length');
  });

  it('should throw an error when trying to make a Boat when a negative amount of maximum occupants is entered', () => {
    expect(() =>
      Boat.createBoat('test', 123, 250, true, '', 25, -1, 'motor', 100)
    ).to.throw('invalid maximum number of occupants');
  });

  it('should throw an error when trying to make a Boat when an amount of zero maximum occupants is entered', () => {
    expect(() =>
      Boat.createBoat('test', 123, 250, true, '', 25, 0, 'motor', 100)
    ).to.throw('invalid maximum number of occupants');
  });
});
