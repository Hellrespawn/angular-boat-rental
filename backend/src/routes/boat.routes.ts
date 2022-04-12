import { Request, Response, Router } from 'express';
import { BoatController } from '../controller/boat.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function addBoatRoutes(controller: BoatController): Router {
  const boatRouter = Router();

  boatRouter.get('/boat', (req: Request, res: Response): void => {
    controller.getBoats(req, res);
  });

  boatRouter.get('/boat/rental', (req: Request, res: Response): void => {
    controller.getBoatOverviewData(req, res);
  });

  boatRouter.get(
    '/boat/rental.:id',
    validateIdInUrlParams,
    (req: Request, res: Response): void => {
      controller.getBoatDetailData(req, res);
    }
  );

  boatRouter.post(
    '/boat',
    async (req: Request, res: Response): Promise<void> => {
      controller.addBoat(req, res);
    }
  );

  boatRouter.delete(
    '/delete-boat/:id',
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteBoat(req, res);
    }
  );

  boatRouter.patch(
    '/update-boat',
    async (req: Request, res: Response): Promise<void> => {
      controller.updateBoat(req, res);
    }
  );

  return boatRouter;
}
