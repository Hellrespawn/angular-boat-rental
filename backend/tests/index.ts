import { SinonSandbox, SinonStub } from 'sinon';
import { NewUserData } from 'auas-common';
import { BoatDao } from '../src/database/boat.dao';
import { SessionDao } from '../src/database/session.dao';
import { UserDao } from '../src/database/user.dao';
import { Boat } from '../src/model/boat';
import { Session } from '../src/model/session';
import { User } from '../src/model/user';
import { SessionService } from '../src/services/session.service';

export function stubAuth(sandbox: SinonSandbox, user: User): void {
  const stub = sandbox.stub(SessionService.prototype, 'getBySessionId');

  stub.returns(Promise.resolve({ user } as unknown as Session));
}

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

export function stubSessionDao(sandbox: SinonSandbox): {
  getStub: SinonStub<[sessionId: string], Promise<Session | null>>;
  deleteStub: SinonStub<[Session], Promise<boolean>>;
  saveStub: SinonStub<[Session], Promise<void>>;
} {
  const getStub = sandbox.stub(SessionDao.prototype, 'getBySessionId');
  const deleteStub = sandbox.stub(SessionDao.prototype, 'delete');
  const saveStub = sandbox.stub(SessionDao.prototype, 'save');

  return { getStub, deleteStub, saveStub };
}

export const TEST_USER = {
  firstName: 'Stef',
  lastName: 'Korporaal',
  license: false,
  emailAddress: 'test@test.com',
  password: 'abcdef1A',
};

export function stubUserDao(
  sandbox: SinonSandbox,
  defaultValue?: User
): {
  countStub: SinonStub<[], Promise<number>>;
  getByEmailStub: SinonStub<[emailAddress: string], Promise<User | null>>;
  getByIdStub: SinonStub<[id: number], Promise<User | null>>;
  saveStub: SinonStub<[User], Promise<void>>;
} {
  const countStub = sandbox.stub(UserDao.prototype, 'count');
  countStub.returns(Promise.resolve(0));

  const getByEmailStub = sandbox.stub(UserDao.prototype, 'getByEmail');
  getByEmailStub.returns(Promise.resolve(null));

  const getByIdStub = sandbox.stub(UserDao.prototype, 'getById');

  if (defaultValue) {
    getByIdStub.returns(Promise.resolve(defaultValue));
  }

  const saveStub = sandbox.stub(UserDao.prototype, 'save');

  return { countStub, getByEmailStub, getByIdStub, saveStub };
}
