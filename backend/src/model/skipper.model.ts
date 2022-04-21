import { Table, Column, Model, Unique, HasMany } from 'sequelize-typescript';
import { Rental } from './rental.model';
export type SkipperData = {
  name: string;
  pricePerDay: number;
  birthDate: Date;
  leave: boolean;
};

@Table
export class Skipper extends Model implements SkipperData {
  @Unique @Column public name!: string;

  @Column public pricePerDay!: number;

  @Column public birthDate!: Date;

  @Column public leave!: boolean;

  @HasMany(() => Rental)
  public rentals!: Rental[];
}
