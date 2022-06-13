import { Request, Response, Router } from 'express';
import { Validator } from '../util/validator';
import {
  NEW_SKIPPER_SCHEMA,
  SkipperController,
} from '../controller/skipper.controller';
import { validateIdInUrlParams } from '../middleware/validate';

const newSkipperValidator = new Validator(NEW_SKIPPER_SCHEMA);

export function skipperRoutes(controller: SkipperController): Router {
  const router = Router();

  // TODO Check if skipper available between dates
  router.get('/skippers/:id/:dateStart/:dateEnd', validateIdInUrlParams());

  // TODO Get availability for all skippers
  router.get('/skippers/:dateStart/:dateEnd');

  router.get('/skippers', (req: Request, res: Response): void => {
    controller.getSkippers(req, res);
  });

  router.post(
    '/skippers',
    newSkipperValidator.middleware(),
    async (req: Request, res: Response): Promise<void> => {
      controller.addSkipper(req, res);
    }
  );

  router.delete(
    '/skippers/:id',
    validateIdInUrlParams(),
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteSkipper(req, res);
    }
  );

  router.patch(
    '/skippers',
    async (req: Request, res: Response): Promise<void> => {
      controller.updateLeaveOfSkipper(req, res);
    }
  );

  return router;
}
