import { MessageService } from '../services/message.service';
import express from 'express';
import { MessageModel } from '../database/message.dao';

export class MessageController {
  constructor(private messageService: MessageService = new MessageService()) {}

  //   // get messages from database
  public async getMessages(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const message: MessageModel[] =
      await this.messageService.getMessagesThroughService();
    res.json({ message });
  }

  //   add messages to database
  public async addMessages(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const email: string = req.body.email;
    const text: string = req.body.text;
    {
      try {
        const result = await this.messageService.sendMessagesToDao(
          name,
          email,
          text
        );
        res.status(200).json(result);
      } catch {
        console.error();
        res.status(400).json('Message cant be send');
      }
    }
  }
}
