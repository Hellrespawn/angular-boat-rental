import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { stubBoatDao } from '..';
import { Boat, MotorBoat, SailBoat } from '../../src/model/boat';

const SANDBOX = sinon.createSandbox();

describe('Unit test Boat, SailBoat, MotorBoat', () => {
  let boatDaoCheckRegStub: SinonStub<
    [registrationNumber: number],
    Promise<boolean>
  >;

  beforeEach(() => {
    ({ boatDaoCheckRegStub } = stubBoatDao(SANDBOX));
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  it('creates a SailBoat with valid values', async () => {
    const boat = await Boat.createBoat(
      1234,
      1234,
      '',
      1234,
      1234,
      'sail',
      undefined,
      undefined,
      1234
    );

    expect(boatDaoCheckRegStub.callCount).to.equal(1);
    expect(boat).to.be.instanceOf(SailBoat);
  });

  it('creates a MotorBoat with valid values', async () => {
    const boat = await Boat.createBoat(
      1234,
      1234,
      '',
      1234,
      1234,
      'motor',
      undefined,
      1234,
      undefined
    );

    expect(boatDaoCheckRegStub.callCount).to.equal(1);
    expect(boat).to.be.instanceOf(MotorBoat);
  });

  it('throws an error when registrationNumber exists', async () => {
    boatDaoCheckRegStub.returns(Promise.resolve(true));

    try {
      await Boat.createBoat(
        1234,
        1234,
        '',
        1234,
        1234,
        'motor',
        undefined,
        1234,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain('Registration Number');
      expect((error as Error).message).to.contain('is already in use!');
    }
  });

  it("throws an error when SailBoat doesn't have sailAreaInM2 ", async () => {
    try {
      await Boat.createBoat(
        1234,
        1234,
        '',
        1234,
        1234,
        'sail',
        undefined,
        undefined,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain(
        'SailBoat must be accompanied by sailAreaInM2'
      );
    }
  });

  it("throws an error when MotorBoat doesn't have maxSpeedInKmH ", async () => {
    try {
      await Boat.createBoat(
        1234,
        1234,
        '',
        1234,
        1234,
        'motor',
        undefined,
        undefined,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain(
        'MotorBoat must be accompanied by maxSpeedInKmH'
      );
    }
  });

  it('throws an error when pricePerDay <= 0', async () => {
    try {
      await Boat.createBoat(
        1234,
        0,
        '',
        1234,
        1234,
        'motor',
        undefined,
        1234,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain('must be greater than 0');
    }
  });

  it('throws an error when lengthInM <= 0', async () => {
    try {
      await Boat.createBoat(
        1234,
        1234,
        '',
        0,
        1234,
        'motor',
        undefined,
        1234,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain('must be greater than 0');
    }
  });

  it('throws an error when maxOccupants <= 0', async () => {
    try {
      await Boat.createBoat(
        1234,
        1234,
        '',
        1234,
        0,
        'motor',
        undefined,
        1234,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain('must be greater than 0');
    }
  });

  it('throws an error when maxSpeedInKmH <= 0', async () => {
    try {
      await Boat.createBoat(
        1234,
        1234,
        '',
        1234,
        1234,
        'motor',
        undefined,
        0,
        undefined
      );
    } catch (error) {
      expect((error as Error).message).to.contain('must be greater than 0');
    }
  });
});
