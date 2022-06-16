import { Request, Response, Router } from 'express';
import { BoatController, NEW_BOAT_SCHEMA } from '../controller/boat.controller';
import { requireAdminRights } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';
import { Validator } from '../util/validator';

const newBoatValidator = new Validator(NEW_BOAT_SCHEMA);

export function boatRoutes(controller: BoatController): Router {
  const router = Router();

  router.get('/', requireAdminRights, (req: Request, res: Response): void => {
    controller.getBoats(req, res);
  });

  router.get('/overview', (req: Request, res: Response): void => {
    controller.getBoatsOverviewData(req, res);
  });

  // Get all available boats between dates.
  router.get(
    '/overview/available/:dateStart/:dateEnd',
    async (req: Request, res: Response): Promise<void> => {
      controller.getAvailableBoatsOverviewData(req, res);
    }
  );

  router.get(
    '/:id/detail',
    validateIdInUrlParams(),
    (req: Request, res: Response): void => {
      controller.getBoatDetailData(req, res);
    }
  );

  router.get(
    '/:id/bookedDates',
    validateIdInUrlParams(),
    async (req: Request, res: Response): Promise<void> => {
      controller.getBookedDates(req, res);
    }
  );

  router.post(
    '/',
    requireAdminRights,
    newBoatValidator.middleware(),
    async (req: Request, res: Response): Promise<void> => {
      controller.addBoat(req, res);
    }
  );

  router.delete(
    '/:id',
    validateIdInUrlParams(),
    requireAdminRights,
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteBoat(req, res);
    }
  );

  router.patch(
    '/',
    requireAdminRights,
    async (req: Request, res: Response): Promise<void> => {
      controller.updateMaintenanceValueOfBoat(req, res);
    }
  );

  return router;
}
