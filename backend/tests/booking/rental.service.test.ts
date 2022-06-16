/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import {
  stubBoatDao,
  stubRentalDao,
  stubUserDao,
  TEST_BOAT,
  TEST_RENTAL,
} from '.';
import { Boat } from '../../src/model/boat';
import { Rental } from '../../src/model/rental';
import { User } from '../../src/model/user';
import { RentalService } from '../../src/services/rental.service';

const SANDBOX = sinon.createSandbox();

describe('Test RentalService', () => {
  let service: RentalService;

  let saveRentalStub: SinonStub<[rental: Rental], Promise<number>>;
  let boatDaoGetByIdStub: SinonStub<[id: number], Promise<Boat | null>>;
  let userDaoGetByIdStub: SinonStub<[id: number], Promise<User | null>>;

  beforeEach(async () => {
    ({ rentalDaoSaveRentalStub: saveRentalStub } = stubRentalDao(SANDBOX, [
      TEST_RENTAL,
    ]));
    ({ boatDaoGetByIdStub } = stubBoatDao(SANDBOX, TEST_BOAT));
    ({ userDaoGetByIdStub } = stubUserDao(SANDBOX, {} as unknown as User));
    service = new RentalService();
  });

  afterEach(() => {
    SANDBOX.restore();
  });

  describe('Test RentalService.addRental()', () => {
    it('Saves a valid rental', async () => {
      await service.addRental(
        1,
        1,
        new Date('2022-02-01'),
        new Date('2022-02-10')
      );

      expect(saveRentalStub.callCount).to.equal(1);
    });

    it('Rejects an invalid boat', async () => {
      boatDaoGetByIdStub.returns(Promise.resolve(null));

      try {
        await service.addRental(
          0,
          1,
          new Date('2022-02-01'),
          new Date('2022-02-10')
        );
        expect.fail('addRental with invalid boatId should not succeed!');
      } catch (error) {
        expect((error as Error).message).to.include('No boat with id');
        expect(saveRentalStub.callCount).to.equal(0);
      }
    });

    it('Rejects an invalid user', async () => {
      userDaoGetByIdStub.returns(Promise.resolve(null));

      try {
        await service.addRental(
          1,
          0,
          new Date('2022-02-01'),
          new Date('2022-02-10')
        );
        expect.fail('addRental with invalid userId should not succeed!');
      } catch (error) {
        expect((error as Error).message).to.include('No user with id');
        expect(saveRentalStub.callCount).to.equal(0);
      }
    });

    it('Rejects too short date', async () => {
      try {
        await service.addRental(
          1,
          1,
          new Date('2022-02-01'),
          new Date('2022-02-02')
        );
        expect.fail('addRental with too short date should not succeed');
      } catch (error) {
        expect((error as Error).message).to.include(
          'Rental period must be at least three days'
        );
        expect(saveRentalStub.callCount).to.equal(0);
      }
    });

    it('Rejects unavailable boat', async () => {
      try {
        await service.addRental(
          1,
          1,
          new Date('2022-01-01'),
          new Date('2022-01-10')
        );
        expect.fail('Boat is not available');
      } catch (error) {
        expect((error as Error).message).to.include('Boat is not available');
        expect(saveRentalStub.callCount).to.equal(0);
      }
    });

    it('Rejects too short date', async () => {
      try {
        await service.addRental(
          1,
          1,
          new Date('2022-02-01'),
          new Date('2022-02-02')
        );
        expect.fail('Boat is not available');
      } catch (error) {
        expect((error as Error).message).to.include(
          'Rental period must be at least three days!'
        );
        expect(saveRentalStub.callCount).to.equal(0);
      }
    });
  });
});
