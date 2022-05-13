import { Message } from '../model/message.model';

export class MessageService {
  private messageArray: Message[] = [];

  // function to return all messages from database
  public async returnAllMessages(): Promise<Array<Message>> {
    this.messageArray = await Message.findAll();
    return this.messageArray;
  }
}
