/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon, { type SinonStub } from 'sinon';
import { stubRentalDao, TEST_BOAT, TEST_RENTAL } from '.';
import { type Boat } from '../../src/model/boat';
import { type Rental } from '../../src/model/rental';
import { BoatService } from '../../src/services/boat.service';
import { stubBoatDao } from '../stubs/boat.stub';

const SANDBOX = sinon.createSandbox();

describe('Test BoatService', () => {
  let service: BoatService;

  let rentalDaoGetRentalsByBoatIdStub: SinonStub<
    [boatId: number],
    Promise<Rental[]>
  >;
  let boatDaoGetBoatsStub: SinonStub<[], Promise<Boat[]>>;

  beforeEach(() => {
    ({ boatDaoGetBoatsStub } = stubBoatDao(SANDBOX, TEST_BOAT));
    ({ rentalDaoGetRentalsByBoatRegStub: rentalDaoGetRentalsByBoatIdStub } =
      stubRentalDao(SANDBOX, [TEST_RENTAL]));

    service = BoatService.getInstance();
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('Test BoatService.getBookedDates()', () => {
    it('Gets booked dates between dates', async () => {
      const expected = [
        new Date('2022-01-01T00:00:00.000Z'),
        new Date('2022-01-02T00:00:00.000Z'),
        new Date('2022-01-03T00:00:00.000Z'),
        new Date('2022-01-04T00:00:00.000Z'),
        new Date('2022-01-05T00:00:00.000Z'),
        new Date('2022-01-06T00:00:00.000Z'),
        new Date('2022-01-07T00:00:00.000Z'),
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z'),
        new Date('2022-01-10T00:00:00.000Z'),
      ];

      const dates = await service.getBookedDates(1);

      expect(dates).to.deep.equal(expected);
    });

    it('Gets empty booked dates', async () => {
      rentalDaoGetRentalsByBoatIdStub.returns(Promise.resolve([]));
      const expected: never[] = [];

      const dates = await service.getBookedDates(1);

      expect(dates).to.deep.equal(expected);
    });
  });

  describe('Test BoatService.getBoatsOverviewData()', () => {
    it('Correctly transforms Boat to BoatOverviewData', async () => {
      boatDaoGetBoatsStub.returns(Promise.resolve([TEST_BOAT]));

      const expected = [
        {
          registrationNumber: TEST_BOAT.registrationNumber,
          name: TEST_BOAT.name,
          imageRoute: TEST_BOAT.imageRoute,
          requirements: 'license',
          maxPassengers: TEST_BOAT.maxPassengers,
          boatType: 'motor',
          maxSpeedInKmH: TEST_BOAT.maxSpeedInKmH,
        },
      ];

      const boats = await service.getOverviewData();

      expect(boats).to.deep.equal(expected);
    });
  });

  describe('Test BoatService.getAvailableBoatsOverviewData()', () => {
    it('Only gets available boats', async () => {
      boatDaoGetBoatsStub.returns(Promise.resolve([TEST_BOAT]));

      const expected = [
        {
          registrationNumber: TEST_BOAT.registrationNumber,
          name: TEST_BOAT.name,
          imageRoute: TEST_BOAT.imageRoute,
          requirements: 'license',
          maxPassengers: TEST_BOAT.maxPassengers,
          boatType: 'motor',
          maxSpeedInKmH: TEST_BOAT.maxSpeedInKmH,
        },
      ];

      let boats = await service.getAvailableOverviewData(
        new Date('2022-01-01'),
        new Date('2022-01-10')
      );

      expect(boats).to.deep.equal([]);

      boats = await service.getAvailableOverviewData(
        new Date('2022-02-01'),
        new Date('2022-02-10')
      );

      expect(boats).to.deep.equal(expected);
    });
  });

  describe('Test BoatService.getBoatDetailData()', () => {
    it('Correctly transforms Boat to BoatDetailData', async () => {
      const expected = {
        registrationNumber: TEST_BOAT.registrationNumber,
        name: TEST_BOAT.name,
        imageRoute: TEST_BOAT.imageRoute,
        requirements: 'license',
        maxPassengers: TEST_BOAT.maxPassengers,
        boatType: 'motor',
        maxSpeedInKmH: TEST_BOAT.maxSpeedInKmH,
        pricePerDay: TEST_BOAT.pricePerDay,
        lengthInM: TEST_BOAT.lengthInM,
      };

      const boat = await service.getDetailData(1);

      expect(boat).to.deep.equal(expected);
    });
  });
});
