import { Message } from '../model/message.model';
export class MessageService {
  private messageArray: Array<Message> = [];

  private async updateMessage(): Promise<void> {
    this.messageArray = await Message.findAll();
  }

  public async returnAllMessages(): Promise<Array<Message>> {
    await this.updateMessage();
    return this.messageArray;
  }
}
