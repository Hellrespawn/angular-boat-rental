import { MessageService } from '../services/message.service';

import express from 'express';
import { Message } from '../model/message.model';

export class MessageController {
  constructor(private messageService: MessageService = new MessageService()) {}

  public async getMessage(req: express.Request, res: express.Response) {
    res.json(await Message.findAll());
  }

  public async addMessage(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const name: string = req.body.name;
    const email: number = req.body.email;
    const text: number = req.body.text;
    {
      try {
        const result = await Message.create({ name, email, text });
        res.status(200).json(result);
      } catch {
        console.error();
        res.status(400).json('Message cant be send');
      }
    }
  }
}
