import * as argon2 from 'argon2';
import { UserModel } from '../database/user.dao';
import { RentalModel } from '../database/rental.dao';
import { FineModel } from 'src/database/fine.dao';

export class User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public license: boolean,

    public dateOfBirth: Date,
    public emailAddress: string,
    public password: string,
    public blocked: boolean,
    public admin: boolean,
    public arrayOfFines: FineModel[]
  ) {}

  public static fromModel(model: UserModel): User {
    return new User(
      model.id,
      model.firstName,
      model.lastName,
      model.license,
      model.dateOfBirth,
      model.emailAddress,
      model.password,
      model.blocked,
      model.admin,
      model.arrayOfFines
    );
  }

  public static async createWithPlaintextPassword(
    firstName: string,
    lastName: string,
    license: boolean,
    dateOfBirth: Date,
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
      dateOfBirth,
      emailAddress,
      await User.hashPassword(password),
      blocked,
      admin,
      []
    );
  }

  public static async hashPassword(plaintext: string): Promise<string> {
    return await argon2.hash(plaintext);
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }

  public async getRentals(): Promise<RentalModel[]> {
    return await RentalModel.findAll({ where: { userId: this.id } });
  }
}
