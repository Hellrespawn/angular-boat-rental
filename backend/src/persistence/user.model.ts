import {
  Table,
  Column,
  Model,
  IsEmail,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { RentalModel } from './rental.model';

@Table
export class UserModel extends Model {
  @AllowNull(false) @Column public firstName!: string;

  @AllowNull(false) @Column public lastName!: string;

  @AllowNull(false) @Column public license!: boolean;

  @AllowNull(false) @IsEmail @Column public emailAddress!: string;

  @AllowNull(false) @Column public password!: string;

  @AllowNull(false) @Column public blocked!: boolean;

  @AllowNull(false) @Column public admin!: boolean;

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];
}
