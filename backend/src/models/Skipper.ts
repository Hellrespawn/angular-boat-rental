import { Table, Column, Model, Unique } from "sequelize-typescript";

@Table
export class Skipper extends Model {
  @Unique @Column name!: string;

  @Column price!: number;
}