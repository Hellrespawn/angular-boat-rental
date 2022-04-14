import { Message } from '../model/message.model';
export class MessageService {
  private messageArray: Array<Message> = [];

  private async getMessage(): Promise<void> {
    this.messageArray = await Message.findAll();
  }

  public async returnAllMessages(): Promise<Array<Message>> {
    await this.getMessage();
    return this.messageArray;
  }
}
