/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SinonSandbox, type SinonStub } from 'sinon';
import { RentalDao } from '../../src/database/rental.dao';
import { MotorBoat } from '../../src/model/boat';
import { Rental } from '../../src/model/rental';
import { type User } from '../../src/model/user';

export const TEST_BOAT = new MotorBoat(
  1,
  1234,
  '',
  1234,
  1234,
  1234,
  'Test Boat'
);

export const TEST_RENTAL = new Rental(
  1,
  TEST_BOAT,
  {} as unknown as User,
  new Date('2022-01-01'),
  new Date('2022-01-10'),
  false
);

export function stubRentalDao(
  sandbox: SinonSandbox,
  defaultValue?: Rental[]
): {
  rentalDaoGetRentalsByBoatRegStub: SinonStub<
    [boatregistrationNumber: number],
    Promise<Rental[]>
  >;
  rentalDaoSaveRentalStub: SinonStub<[rental: Rental], Promise<number>>;
  rentalDaoGetUpcomingRentalsByUserIdStub: SinonStub<
    [registrationNumber: number],
    Promise<Rental[]>
  >;
} {
  const saveRentalStub = sandbox.stub(RentalDao.prototype, 'saveRental');
  saveRentalStub.returns(Promise.resolve(1));

  const getRentalsByBoatRegStub = sandbox.stub(
    RentalDao.prototype,
    'getRentalsByBoatRegistrationNumber'
  );

  if (defaultValue) {
    getRentalsByBoatRegStub.returns(Promise.resolve(defaultValue));
  }

  const getUpcomingRentalsByUserIdStub = sandbox.stub(
    RentalDao.prototype,
    'getUpcomingRentalsByUserId'
  );

  if (defaultValue) {
    getUpcomingRentalsByUserIdStub
      .withArgs(1)
      .returns(Promise.resolve([TEST_RENTAL]));
  }

  return {
    rentalDaoGetRentalsByBoatRegStub: getRentalsByBoatRegStub,
    rentalDaoGetUpcomingRentalsByUserIdStub: getUpcomingRentalsByUserIdStub,
    rentalDaoSaveRentalStub: saveRentalStub,
  };
}
