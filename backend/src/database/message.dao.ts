import { Table, Column, Model, AllowNull, IsEmail } from 'sequelize-typescript';

@Table
export class MessageModel extends Model {
  // message model for database input
  @AllowNull(false) @Column public name!: string;
  @AllowNull(false) @IsEmail @Column public email!: string;
  @AllowNull(false) @Column public text!: string;
}
