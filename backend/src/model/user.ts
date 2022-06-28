import * as argon2 from 'argon2';
import { UserModel } from '../database/user.dao';
import { RentalDao } from '../database/rental.dao';
import { Rental } from './rental';
import { SessionDao } from '../database/session.dao';
import { Session } from './session';

export class User {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly license: boolean,

    public readonly emailAddress: string,
    public readonly password: string,
    public blocked: boolean,
    public readonly admin: boolean
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
      model.admin
    );
  }

  /**
   * Create a user with a plaintext password that gets hashed.
   */
  public static async create(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    plaintextPassword: string,
    blocked: boolean,
    admin: boolean
  ): Promise<User> {
    return new User(
      -1,
      firstName,
      lastName,
      license,
      emailAddress,
      await User.hashPassword(plaintextPassword),
      blocked,
      admin
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

  /**
   * Gets rental associated with user.
   */
  public async getRentals(): Promise<Rental[]> {
    return await RentalDao.getInstance().getRentalsByUserId(this.id);
  }

  /**
   * Gets sessions associated with user.
   */
  public async getSessions(): Promise<Session[]> {
    return await SessionDao.getInstance().getSessionsByUserId(this.id);
  }
}
