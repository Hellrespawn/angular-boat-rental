import { type SinonSandbox, type SinonStub } from 'sinon';
import { BoatDao } from '../../src/database/boat.dao';
import { type Boat } from '../../src/model/boat';

export function stubBoatDao(
  sandbox: SinonSandbox,
  defaultValue?: Boat
): {
  boatDaoCheckRegStub: SinonStub<
    [registrationNumber: number],
    Promise<boolean>
  >;
  boatDaoGetBoatsStub: SinonStub<[], Promise<Boat[]>>;
  boatDaoGetByRegStub: SinonStub<
    [registrationNumber: number],
    Promise<Boat | null>
  >;
  boatDaoSaveStub: SinonStub<[newBoat: Boat], Promise<void>>;
} {
  const boatDaoCheckRegStub = sandbox.stub(
    BoatDao.prototype,
    'checkRegistrationNumberExists'
  );

  boatDaoCheckRegStub.returns(Promise.resolve(false));

  const boatDaoGetBoatsStub = sandbox.stub(BoatDao.prototype, 'getAll');

  boatDaoGetBoatsStub.returns(Promise.resolve([]));

  const boatDaoGetByRegStub = sandbox.stub(
    BoatDao.prototype,
    'getByRegistrationNumber'
  );

  const boatDaoSaveStub = sandbox.stub(BoatDao.prototype, 'save');

  if (defaultValue) {
    boatDaoGetByRegStub
      .withArgs(defaultValue.registrationNumber)
      .returns(Promise.resolve(defaultValue));
  }

  return {
    boatDaoCheckRegStub,
    boatDaoGetBoatsStub,
    boatDaoGetByRegStub,
    boatDaoSaveStub,
  };
}
