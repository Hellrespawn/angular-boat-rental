import { Application, Request, Response } from 'express';
import { SkipperController } from '../controller/skipper.controller';

export function addSkipperRoutes(
  app: Application,
  controller: SkipperController
): void {
  app.get('/skipper', (req: Request, res: Response): void => {
    controller.getSkippers(req, res);
  });

  app.post('/skipper', async (req: Request, res: Response): Promise<void> => {
    controller.addSkipper(req, res);
  });
  
  app.delete(
    '/delete-skipper/:id',
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteSkipper(req, res);
    }
  );
}
