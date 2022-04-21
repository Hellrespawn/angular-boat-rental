import { Request, Response, Router } from 'express';
import { SkipperController } from '../controller/skipper.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function skipperRoutes(controller: SkipperController): Router {
  const router = Router();

  // TODO Check if skipper available between dates
  router.get('/skipper/:id/:dateStart/:dateEnd', validateIdInUrlParams);

  // TODO Get availability for all skippers
  router.get('/skipper/:dateStart/:dateEnd');

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

  router.patch(
    '/update-skipper',
    async (req: Request, res: Response): Promise<void> => {
      controller.updateSkipper(req, res);
    }
  );

  return router;
}
