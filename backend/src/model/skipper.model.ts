import { Table, Column, Model, Unique, DataType } from 'sequelize-typescript';

export type SkipperData = {
  name: string;
  pricePerDay: number;
  birthDate: Date;
};

@Table
export class Skipper extends Model implements SkipperData {
  @Unique @Column public name!: string;

  @Column public pricePerDay!: number;

  @Column(DataType.DATE) public birthDate!: Date;
}
