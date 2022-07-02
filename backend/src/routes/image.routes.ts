/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { ImageController } from '../controller/image.controller';
import { requireAdminRights } from '../middleware/auth';

export function getImageRouter(): Router {
  const imageController = ImageController.getInstance();
  const router = Router();
  router.get(
    '/check/:name(\\S{0,})',
    requireAdminRights,
    imageController.check.bind(imageController)
  );

  // Theoretically, this would be /:name(.*), but this is broken in express
  // 4.x. https://github.com/expressjs/express/issues/2495
  router.post(
    '/:name(\\S{0,})',
    requireAdminRights,
    imageController.save.bind(imageController)
  );

  router.delete(
    '/:name(\\S{0,})',
    requireAdminRights,
    imageController.delete.bind(imageController)
  );

  return router;
}
