// import { Message } from 'src/model/message';
import { Message } from '../../src/model/message';
import { MessageDao, MessageModel } from '../database/message.dao';

export class MessageService {
  private messageDao: MessageDao = new MessageDao();

  private messageArray: MessageDao[] = [];

  // function to return all messages from database
  public async getMessagesThroughService(): Promise<MessageModel[]> {
    return this.messageDao.returnAllMessages();
  }

  public async sendMessagesToDao(name: string, email: string, text: string) {
    return this.messageDao.newMessage(name, email, text);
  }
}
