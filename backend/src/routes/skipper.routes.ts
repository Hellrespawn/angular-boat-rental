import { Request, Response, Router } from 'express';
import { SkipperController } from '../controller/skipper.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function addSkipperRoutes(controller: SkipperController): Router {
  const router = Router();

  router.get('/skipper', (req: Request, res: Response): void => {
    controller.getSkippers(req, res);
  });

  router.post(
    '/skipper',
    async (req: Request, res: Response): Promise<void> => {
      controller.addSkipper(req, res);
    }
  );

  router.delete(
    '/delete-skipper/:id',
    validateIdInUrlParams,
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteSkipper(req, res);
    }
  );

  return router;
}
