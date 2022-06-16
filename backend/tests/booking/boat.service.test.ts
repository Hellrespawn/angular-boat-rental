/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { stubBoatDao, stubRentalDao, TEST_BOAT, TEST_RENTAL } from '.';
import { Boat } from '../../src/model/boat';
import { Rental } from '../../src/model/rental';
import { BoatService } from '../../src/services/boat.service';

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
    ({ rentalDaoGetRentalsByBoatIdStub } = stubRentalDao(SANDBOX, [
      TEST_RENTAL,
    ]));

    service = new BoatService();
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

    it('Gets empty  booked dates', async () => {
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
          id: TEST_BOAT.id,
          name: TEST_BOAT.name,
          imageRoute: TEST_BOAT.imageRoute,
          requirements: 'license',
          maxOccupants: TEST_BOAT.maxOccupants,
          boatType: 'motor',
          maxSpeedInKmH: TEST_BOAT.maxSpeedInKmH,
        },
      ];

      const boats = await service.getBoatsOverviewData();

      expect(boats).to.deep.equal(expected);
    });
  });

  describe('Test BoatService.getAvailableBoatsOverviewData()', () => {
    it('Only gets available boats', async () => {
      boatDaoGetBoatsStub.returns(Promise.resolve([TEST_BOAT]));

      const expected = [
        {
          id: TEST_BOAT.id,
          name: TEST_BOAT.name,
          imageRoute: TEST_BOAT.imageRoute,
          requirements: 'license',
          maxOccupants: TEST_BOAT.maxOccupants,
          boatType: 'motor',
          maxSpeedInKmH: TEST_BOAT.maxSpeedInKmH,
        },
      ];

      let boats = await service.getAvailableBoatsOverviewData(
        new Date('2022-01-01'),
        new Date('2022-01-10')
      );

      expect(boats).to.deep.equal([]);

      boats = await service.getAvailableBoatsOverviewData(
        new Date('2022-02-01'),
        new Date('2022-02-10')
      );

      expect(boats).to.deep.equal(expected);
    });
  });

  describe('Test BoatService.getBoatDetailData()', () => {
    it('Correctly transforms Boat to BoatOverviewData', async () => {
      const expected = {
        id: TEST_BOAT.id,
        name: TEST_BOAT.name,
        imageRoute: TEST_BOAT.imageRoute,
        requirements: 'license',
        maxOccupants: TEST_BOAT.maxOccupants,
        boatType: 'motor',
        maxSpeedInKmH: TEST_BOAT.maxSpeedInKmH,
        registrationNumber: TEST_BOAT.registrationNumber,
        pricePerDay: TEST_BOAT.pricePerDay,
        lengthInM: TEST_BOAT.lengthInM,
      };

      const boat = await service.getBoatDetailData(1);

      expect(boat).to.deep.equal(expected);
    });
  });
});
