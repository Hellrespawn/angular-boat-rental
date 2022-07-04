import * as argon2 from 'argon2';
import { UserModel } from '../persistence/user.model';
import { RentalDao } from '../persistence/rental.dao';
import { Rental } from './rental';
import { SessionDao } from '../persistence/session.dao';
import { Session } from './session';
import { ServerError } from '../util/error';

export class User {
  public static minUppercaseLetters = 1;
  public static minNumbers = 1;
  public static minLength = 6;

  private constructor(
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
      model.id as number,
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
    this.validatePassword(plaintextPassword);

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
  public static hashPassword(plaintext: string): Promise<string> {
    return argon2.hash(plaintext);
  }

  private static validatePassword(password: string): void {
    if (password.length < this.minLength) {
      throw new ServerError(
        `Password requires at least ${this.minLength} characters`
      );
    }

    if ((password.match(/[A-Z]/g) ?? []).length < this.minUppercaseLetters) {
      throw new ServerError(
        `Password requires at least ${this.minUppercaseLetters} uppercase.`
      );
    }

    if ((password.match(/[0-9]/g) ?? []).length < this.minNumbers) {
      throw new ServerError(
        `Password requires at least ${this.minNumbers} numbers.`
      );
    }
  }

  /**
   * Verify a plaintext password
   */
  public verifyPassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }

  /**
   * Gets rental associated with user.
   */
  public getRentals(): Promise<Rental[]> {
    return RentalDao.getInstance().getRentalsByUserId(this.id);
  }

  /**
   * Gets sessions associated with user.
   */
  public getSessions(): Promise<Session[]> {
    return SessionDao.getInstance().getSessionsByUserId(this.id);
  }
}
