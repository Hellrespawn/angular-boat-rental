import { MessageModel } from '../database/message.dao';

export class MessageService {
  private messageArray: MessageModel[] = [];

  // function to return all messages from database
  public async returnAllMessages(): Promise<Array<MessageModel>> {
    this.messageArray = await MessageModel.findAll();
    return this.messageArray;
  }
}
