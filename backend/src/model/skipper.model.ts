import { Table, Column, Model, Unique, HasMany } from 'sequelize-typescript';
import { Rental } from './rental.model';

@Table
export class Skipper extends Model {
  @Unique @Column public name!: string;

  @Column public price!: number;

  @HasMany(() => Rental)
  public rentals!: Rental[];
}
