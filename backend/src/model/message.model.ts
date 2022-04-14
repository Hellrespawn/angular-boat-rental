import { Table, Column, Model, AllowNull, IsEmail } from 'sequelize-typescript';

export type MessageData = {
  name: string;
  email: string;
  text: string;
};

@Table
export class Message extends Model implements MessageData {
  @AllowNull(false) @Column public name!: string;
  @AllowNull(false) @IsEmail @Column public email!: string;
  @AllowNull(false) @Column public text!: string;
}
