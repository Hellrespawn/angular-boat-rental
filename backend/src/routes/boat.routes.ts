import { Request, Response, Router } from 'express';
import { BoatController } from '../controller/boat.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function boatRoutes(controller: BoatController): Router {
  const router = Router();

  router.get('/boats', (req: Request, res: Response): void => {
    controller.getBoats(req, res);
  });

  router.get('/boats/overview', (req: Request, res: Response): void => {
    controller.getBoatsOverviewData(req, res);
  });

  // Get all available boats between dates.
  router.get(
    '/boats/overview/available/:dateStart/:dateEnd',
    async (req: Request, res: Response): Promise<void> => {
      controller.getAvailableBoatsOverviewData(req, res);
    }
  );

  router.get(
    '/boats/:id/detail',
    validateIdInUrlParams,
    (req: Request, res: Response): void => {
      controller.getBoatDetailData(req, res);
    }
  );

  router.get(
    '/boats/:id/bookedDates',
    validateIdInUrlParams,
    async (req: Request, res: Response): Promise<void> => {
      controller.getBookedDates(req, res);
    }
  );

  router.post('/boats', async (req: Request, res: Response): Promise<void> => {
    controller.addBoat(req, res);
  });

  router.delete(
    '/boats/:id',
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteBoat(req, res);
    }
  );

  router.patch('/boats', async (req: Request, res: Response): Promise<void> => {
    controller.updateBoat(req, res);
  });

  return router;
}
