import { Application, Request, Response } from 'express';
import { ImageController } from '../controller/image.controller';

export const IMAGE_ROUTE = 'image';

export function addImageRoutes(
  app: Application,
  controller: ImageController
): void {
  app.get(`/${IMAGE_ROUTE}/:name`, (req: Request, res: Response): void => {
    controller.getImage(req, res);
  });
}
