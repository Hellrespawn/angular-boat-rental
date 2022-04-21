import { Request, Response, Router } from 'express';
import { BoatController } from '../controller/boat.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function boatRoutes(controller: BoatController): Router {
  const router = Router();

  router.get('/boat', (req: Request, res: Response): void => {
    controller.getBoats(req, res);
  });

  router.get('/boat/rental', (req: Request, res: Response): void => {
    controller.getBoatOverviewData(req, res);
  });

  router.get(
    '/boat/rental/:id',
    validateIdInUrlParams,
    (req: Request, res: Response): void => {
      controller.getBoatDetailData(req, res);
    }
  );

  // Get all available boats between dates.
  router.get(
    '/boat/available/:dateStart/:dateEnd',
    async (req: Request, res: Response): Promise<void> => {
      controller.getAvailableBoatsOverviewData(req, res);
    }
  );

  // Check if boat is available between dates.
  router.get(
    '/boat/:id/available/:dateStart/:dateEnd',
    validateIdInUrlParams,
    async (req: Request, res: Response): Promise<void> => {
      controller.isBoatAvailable(req, res);
    }
  );

  router.post('/boat', async (req: Request, res: Response): Promise<void> => {
    controller.addBoat(req, res);
  });

  router.delete(
    '/delete-boat/:id',
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteBoat(req, res);
    }
  );

  router.patch(
    '/update-boat',
    async (req: Request, res: Response): Promise<void> => {
      controller.updateBoat(req, res);
    }
  );

  return router;
}
