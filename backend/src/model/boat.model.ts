import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

@Table
export class Boat extends Model {
  @Unique @Column public name!: string;

  @Column public price!: number;

  @Column public skipperNeeded!: boolean;

  @AllowNull @Column(DataType.BLOB) public photo?: Blob | null;

  @Column public length!: number;

  @Column public maxSpeed!: number;

  @Column(DataType.ENUM('sail', 'motor')) public sailOrMotor!: string;
}
