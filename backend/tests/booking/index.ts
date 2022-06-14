/* eslint-disable @typescript-eslint/no-explicit-any */
import { SinonSandbox, SinonStub } from 'sinon';
import { BoatDao } from '../../src/database/boat.dao';
import { RentalDao } from '../../src/database/rental.dao';
import { UserDao } from '../../src/database/user.dao';
import { Boat, MotorBoat } from '../../src/model/boat';
import { Rental } from '../../src/model/rental';
import { User } from '../../src/model/user';

export const TEST_BOAT = new MotorBoat(
  1,
  'testboot',
  1234,
  1234,
  false,
  false,
  '',
  1234,
  1234,
  1234
);

export const TEST_RENTAL = new Rental(
  1,
  TEST_BOAT,
  {} as unknown as User,
  new Date('2022-01-01'),
  new Date('2022-01-10'),
  false
);

export function stubBoatDao(
  sandbox: SinonSandbox,
  defaultValue?: Boat
): {
  boatDaoGetBoatsStub: SinonStub<[], Promise<Boat[]>>;
  boatDaoGetByIdStub: SinonStub<[id: number], Promise<Boat | null>>;
} {
  const boatDaoGetBoatsStub = sandbox.stub(BoatDao.prototype, 'getBoats');

  boatDaoGetBoatsStub.returns(Promise.resolve([]));

  const boatDaoGetByIdStub = sandbox.stub(BoatDao.prototype, 'getById');

  if (defaultValue) {
    boatDaoGetByIdStub.returns(Promise.resolve(defaultValue));
  }

  return { boatDaoGetBoatsStub, boatDaoGetByIdStub };
}

export function stubUserDao(
  sandbox: SinonSandbox,
  defaultValue?: User
): { userDaoGetByIdStub: SinonStub<[id: number], Promise<User | null>> } {
  const userDaoGetByIdStub = sandbox.stub(UserDao.prototype, 'getUserById');

  if (defaultValue) {
    userDaoGetByIdStub.returns(Promise.resolve(defaultValue));
  }

  return { userDaoGetByIdStub };
}

export function stubRentalDao(
  sandbox: SinonSandbox,
  defaultValue?: Rental[]
): {
  rentalDaoGetRentalsByBoatIdStub: SinonStub<
    [boatId: number],
    Promise<Rental[]>
  >;
  rentalDaoSaveRentalStub: SinonStub<[rental: Rental], Promise<number>>;
} {
  const saveRentalStub = sandbox.stub(RentalDao.prototype, 'saveRental');
  saveRentalStub.returns(Promise.resolve(1));

  const getRentalsByBoatIdStub = sandbox.stub(
    RentalDao.prototype,
    'getRentalsByBoatId'
  );

  if (defaultValue) {
    getRentalsByBoatIdStub.returns(Promise.resolve(defaultValue));
  }

  return {
    rentalDaoGetRentalsByBoatIdStub: getRentalsByBoatIdStub,
    rentalDaoSaveRentalStub: saveRentalStub,
  };
}
