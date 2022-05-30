import {
  Table,
  Column,
  Model,
  IsEmail,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { Rental } from './rental.model';

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

@Table
export class User extends Model {
  @AllowNull(false) @Column public firstName!: string;
  @AllowNull(false) @Column public lastName!: string;
  @AllowNull(true) @Column public license!: boolean;
  @AllowNull(true)
  //@IsBefore(getRequiredDateString())
  @Column
  public dateOfBirth!: Date;
  @AllowNull(false) @IsEmail @Column public emailAddress!: string;
  @AllowNull(false) @Column public password!: string;
  @AllowNull(false) @Column public blocked!: boolean;
  @AllowNull(false) @Column public admin!: boolean;

  @HasMany(() => Rental)
  public rentals!: Rental[];
}
