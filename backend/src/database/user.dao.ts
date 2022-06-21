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

  /**
   * gets all UserModels from the database and sends them back as Users
   * @returns an array of instances of User
   */
  public async getUsers(): Promise<User[]> {
    return (
      await UserModel.findAll({
        include: [FineModel],
      })
    ).map((userModel) => {
      return User.fromModel(userModel);
    });
  }

  /**
   * tries to find a UserModel from database and return it, if not found throws an error
   * @param idOfUser id of the UserModel
   * @returns the found UserModel
   */
  private async findUserOrThrowError(idOfUser: number): Promise<UserModel> {
    const user: UserModel | null = await UserModel.findByPk(idOfUser);
    if (user !== null) {
      return user;
    } else {
      throw 'User not found';
    }
  }

  /**
   * updates the blocked value of a UserModel found by id
   * @param idOfUser id of the UserModel
   * @param updatedValue new value of blocked
   */
  public async updateBlockedValueOfUser(
    idOfUser: number,
    updatedValue: boolean
  ): Promise<void> {
    const userToUpdate: UserModel = await this.findUserOrThrowError(idOfUser);
    userToUpdate.blocked = updatedValue;
    await userToUpdate.save();
  }

  /**
   * deletes a UserModel from the database found by id
   * @param idOfUser if of the UserModel
   */
  public async deleteUser(idOfUser: number): Promise<void> {
    const userToDelete: UserModel = await this.findUserOrThrowError(idOfUser);
    await userToDelete.destroy();
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
