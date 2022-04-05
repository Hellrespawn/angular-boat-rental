import { Table, Column, Model, Unique } from 'sequelize-typescript';

@Table
export class Skipper extends Model {
  @Unique @Column public name!: string;

  @Column public price!: number;
}
