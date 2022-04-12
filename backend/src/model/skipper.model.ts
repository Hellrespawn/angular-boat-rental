import { Table, Column, Model, Unique, HasMany } from 'sequelize-typescript';
import { Rental } from './rental.model';
export type SkipperData = {
  name: string;
  pricePerDay: number;
  birthDate: Date;
};

@Table
export class Skipper extends Model implements SkipperData {
  @Unique @Column public name!: string;

  @Column public pricePerDay!: number;

  @Column public birthDate!: Date;

  @HasMany(() => Rental)
  public rentals!: Rental[];
}
