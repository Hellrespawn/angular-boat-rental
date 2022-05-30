import { Application, Request, Response, Router } from 'express';
import { MessageController } from '../controller/message.controller';

export function addMessageRoute(
  app: Application,
  controller: MessageController
): void {

  // get request from backend url
  app.get('/faq', (req: Request, res: Response): void => {
    controller.getMessages(req, res);
  });

  // post request to frontend url
  app.post(
    '/veel-gestelde-vragen',
    async (req: Request, res: Response): Promise<void> => {
      controller.addMessages(req, res);
    }
  );
}
