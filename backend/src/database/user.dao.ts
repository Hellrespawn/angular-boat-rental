import {
  Table,
  Column,
  Model,
  IsEmail,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { User } from '../model/user';
import { RentalModel } from './rental.dao';
import { FineModel } from './fine.dao';

const REQUIRED_AGE_IN_YEARS = 18;

function getRequiredDateString(): string {
  const date = new Date();
  const year = (date.getFullYear() - REQUIRED_AGE_IN_YEARS)
    .toString()
    .padStart(4, '0');
  const month = date.getMonth.toString().padStart(2, '0');
  const day = date.getDate.toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class UserDao {
  public async getUsersTest(): Promise<User[]> {
    return (await UserModel.findAll()).map((user: UserModel) =>
      User.fromModel(user)
    );
  }

  public async saveNewUser(newUser: User): Promise<void> {
    UserModel.create({
      id: newUser.id,  
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      license: newUser.license,  
      emailAddress: newUser.emailAddress,
      password: newUser.password,
      blocked: newUser.blocked,
      admin: newUser.admin
    });
  }

  public async getUserByEmail(emailAddress: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { emailAddress } });

    if (model) {
      return User.fromModel(model);
    }

    throw 'User not found!';
  }

  public async getUserById(id: number): Promise<User | null> {
    const model = await UserModel.findOne({ where: { id } });

    if (model) {
      return User.fromModel(model);
    }

    throw 'User not found!';
  }

  public async getUsers(): Promise<User[]> {
    return (
      await UserModel.findAll({
        include: [FineModel],
      })
    ).map((userModel) => {
      return User.fromModel(userModel);
    });
  }

  public async updateBlockedValueOfUser(
    idOfUser: number,
    updatedValue: boolean
  ): Promise<void> {
    const userToUpdate: UserModel | null = await UserModel.findByPk(idOfUser);
    if (userToUpdate !== null) {
      userToUpdate.blocked = updatedValue;
      await userToUpdate.save();
    } else {
      throw 'User not found';
    }
  }

  public async deleteUser(idOfUser: number): Promise<void> {
    const userToDelete: UserModel | null = await UserModel.findByPk(idOfUser);
    if (userToDelete !== null) {
      await userToDelete.destroy();
    } else {
      throw 'userToDelete not found';
    }
  }

  public async createNewUser(
    firstName: string,
    lastName: string,
    license: boolean,
    emailAddress: string,
    password: string,
    blocked: boolean,
    admin: boolean
  ): Promise<UserModel> {
    const result = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      license: false,
      emailAddress: emailAddress,
      password: await User.hashPassword(password),
      blocked: false,
      admin,
    });
    return result;
  }
}

@Table
export class UserModel extends Model {
  @AllowNull(false) @Column public firstName!: string;

  @AllowNull(false) @Column public lastName!: string;

  @AllowNull(false) @Column public license!: boolean;

  //   @AllowNull(true)
  //@IsBefore(getRequiredDateString())
  //   @Column
  //   public dateOfBirth!: Date;
  @AllowNull(false) @IsEmail @Column public emailAddress!: string;

  @AllowNull(false) @Column public password!: string;

  @AllowNull(false) @Column public blocked!: boolean;

  @AllowNull(false) @Column public admin!: boolean;

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];

  @HasMany(() => FineModel)
  public arrayOfFines!: FineModel[];
}
