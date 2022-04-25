import { MessageService } from '../services/message.service';

import express from 'express';
import { Message } from '../model/message.model';

export class MessageController {
  constructor(private messageService: MessageService = new MessageService()) {}

  public async getMessages(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const message: Message[] = await this.messageService.returnAllMessages();
    res.json({ message });
  }

  public async addMessages(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const email: string = req.body.email;
    const text: string = req.body.text;
    {
      try {
        const result = Message.create({ name, email, text });
        res.status(200).json(result);
      } catch {
        console.error();
        res.status(400).json('Message cant be send');
      }
    }
  }
}
