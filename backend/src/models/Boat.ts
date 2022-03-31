import { Table, Column, Model, DataType, AllowNull, Unique } from "sequelize-typescript";

@Table
export class Boat extends Model {
  @Unique @Column name!: string;

  @Column price!: number;

  @Column skipperNeeded!: boolean;

  @AllowNull @Column(DataType.BLOB) photo?: Blob | null;

  @Column length!: number;

  @Column maxSpeed!: number;

  @Column(DataType.ENUM("sail", "motor")) sailOrMotor!: string
}
