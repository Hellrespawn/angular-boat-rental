import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

const BOAT_TYPE = DataType.ENUM('sail', 'motor');

@Table
export class Boat extends Model {
  @Unique @Column public name!: string;

  @Column public registrationNumber!: number;

  @Column public pricePerDay!: number;

  @Column(DataType.BOOLEAN) public skipperNeeded!: boolean;

  @Column(DataType.BOOLEAN) public maintenance!: boolean;

  @AllowNull @Column(DataType.BLOB) public photo?: Buffer | null;

  @Column public lengthInM!: number;

  @Column public maxOccupants!: number;

  @Column(BOAT_TYPE) public boatType!: string;

  @AllowNull @Column public maxSpeedInKmH?: number;

  @AllowNull @Column public sailAreaInM2?: number;
}
