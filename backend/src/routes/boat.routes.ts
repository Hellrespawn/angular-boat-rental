import { Application, Request, Response } from 'express';
import { BoatController } from '../controller/boat.controller';

export function addBoatRoutes(
  app: Application,
  controller: BoatController
): void {
  app.get('/boat', (req: Request, res: Response): void => {
    controller.getBoats(req, res);
  });

  app.post('/boat', async (req: Request, res: Response): Promise<void> => {
    controller.addBoat(req, res);
  });

  app.post('/delete-boat', async (req: Request, res: Response): Promise<void> => {
    controller.deleteBoat(req, res);
  });

  app.post('/update-boat', async (req: Request, res: Response): Promise<void> => {
    controller.updateBoat(req, res);
  });
}
