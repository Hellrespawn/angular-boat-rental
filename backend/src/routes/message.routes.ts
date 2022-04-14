import { Application, Request, Response } from 'express';
import { MessageController } from '../controller/message.controller';

export function addMessageRoute(
  app: Application,
  controller: MessageController
): void {
  app.get('/faq', (req: Request, res: Response): void => {
    controller.getMessage(req, res);
  });

  app.post(
    '/veel-gestelde-vragen',
    async (req: Request, res: Response): Promise<void> => {
      controller.addMessage(req, res);
    }
  );
}
