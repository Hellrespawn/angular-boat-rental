import { Request, Response, Router } from 'express';
import { ImageController } from '../controller/image.controller';

export const IMAGE_ROUTE = 'image';

export function imageRoutes(controller: ImageController): Router {
  const router = Router();

  router.get(`/${IMAGE_ROUTE}/:name`, (req: Request, res: Response): void => {
    controller.getImage(req, res);
  });

  return router;
}
