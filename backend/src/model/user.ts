import * as argon2 from 'argon2';
import { UserModel } from '../database/user.dao';
import { RentalModel } from '../database/rental.dao';

export class User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public license: boolean,

    public emailAddress: string,
    public password: string,
    public blocked: boolean,
    public admin: boolean
  ) {}

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
      admin
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
