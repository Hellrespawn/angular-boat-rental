import * as argon2 from 'argon2';
import { UserModel } from '../database/user.dao';
import { RentalDao, RentalModel } from '../database/rental.dao';
import { FineModel } from '../database/fine.dao';
import { Rental } from './rental';
import { SessionDao } from '../database/session.dao';
import { Session } from './session';

export class User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public license: boolean,

    public emailAddress: string,
    public password: string,
    private blocked: boolean,
    public admin: boolean,
    private arrayOfFines: FineModel[]
  ) {}

  /**
   * Create business model from persistence model.
   */
  public static fromModel(model: UserModel): User {
    return new User(
      model.id,
      model.firstName,
      model.lastName,
      model.license,
      model.emailAddress,
      model.password,
      model.blocked,
      model.admin,
      model.arrayOfFines
    );
  }

  /**
   * Create a user with a plaintext password that gets hashed.
   */
  public static async createWithPlaintextPassword(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    password: string,
    blocked: boolean,
    admin: boolean
  ): Promise<User> {
    return new User(
      -1,
      firstName,
      lastName,
      license,
      emailAddress,
      await User.hashPassword(password),
      blocked,
      admin,
      []
    );
  }

  /**
   * Hash a plaintext password with argon.
   */
  public static async hashPassword(plaintext: string): Promise<string> {
    return await argon2.hash(plaintext);
  }

  /**
   * Verify a plaintext password
   */
  public async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  public async getRentals(): Promise<Rental[]> {
    return await new RentalDao().getRentalsByUserId(this.id);
  }

  public async getSessions(): Promise<Session[]> {
    return await new SessionDao().getSessionsByUserId(this.id);
  }
}
