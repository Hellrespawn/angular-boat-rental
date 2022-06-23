import { MessageService } from '../services/message.service';
import { Message } from '../../src/model/message';

import express from 'express';
import { MessageDao, MessageModel } from '../database/message.dao';

export class MessageController {
  constructor(
    private messageService: MessageService = new MessageService(),
    private messageDao: MessageDao = new MessageDao()
  ) {}

  //   // get messages from database
  public async getMessages(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    // const message: MessageDao[] = await this.messageService.returnAllMessages();
    const message: MessageModel[] =
      await this.messageService.getMessagesFromDao();
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
        // const result = await MessageDao.create({ name, email, text });
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
