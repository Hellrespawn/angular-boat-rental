import { Message } from '../model/message.model';
export class MessageService {
  private messageArray: Array<Message> = [];

  private async updateMessages(): Promise<void> {
    this.messageArray = await Message.findAll();
  }

  public async returnAllMessages(): Promise<Array<Message>> {
    await this.updateMessages();
    return this.messageArray;
  }
}
