import { Table, Column, Model, AllowNull, IsEmail } from 'sequelize-typescript';
export class MessageDao {
  private messageArray: MessageModel[] = [];

  //   function to return all messages from database
  public async returnAllMessages(): Promise<Array<MessageModel>> {
    this.messageArray = await MessageModel.findAll();
    return this.messageArray;
  }

  public async newMessage(
    name: string,
    email: string,
    text: string
  ): Promise<MessageModel> {
    const result = await MessageModel.create({ name, email, text });
    return result;
  }
}
@Table
export class MessageModel extends Model {
  // message model for database input
  @AllowNull(false) @Column public name!: string;

  @AllowNull(false) @IsEmail @Column public email!: string;

  @AllowNull(false) @Column public text!: string;
}
