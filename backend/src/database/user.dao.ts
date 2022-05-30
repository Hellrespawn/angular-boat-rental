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
  public async getUser(emailAddress: string): Promise<User | null> {
    const model = await UserModel.findOne({ where: { emailAddress } });

    if (model) {
      return User.fromModel(model);
    }

    throw 'User not found!';
  }
}

@Table
export class UserModel extends Model {
  @AllowNull(false) @Column public firstName!: string;
  @AllowNull(false) @Column public lastName!: string;
  @AllowNull(true) @Column public license!: boolean;
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
