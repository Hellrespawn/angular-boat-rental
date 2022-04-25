import { Request, Response, Router } from 'express';
import { ImageController } from '../controller/image.controller';

export function imageRoutes(controller: ImageController): Router {
  const router = Router();

  // Theoretically, this would be /:name(.*), but this is broken in express
  // 4.x. https://github.com/expressjs/express/issues/2495
  router.post('/images/:name(\\S{0,})', (req: Request, res: Response): void => {
    controller.saveImage(req, res);
  });

  router.delete(
    '/images/:name(\\S{0,})',
    (req: Request, res: Response): void => {
      controller.deleteImage(req, res);
    }
  );

  return router;
}
