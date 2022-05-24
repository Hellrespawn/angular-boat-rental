import { Table, Column, Model, Unique, HasMany } from 'sequelize-typescript';
import { RentalModel } from './rental.dao';

@Table
export class SkipperModel extends Model {
  @Unique @Column public name!: string;

  @Column public pricePerDay!: number;

  @Column public birthDate!: Date;

  @Column public leave!: boolean;

  @HasMany(() => RentalModel)
  public rentals!: RentalModel[];
}
