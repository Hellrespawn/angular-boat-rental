import { Request, Response, Router } from 'express';
import { FineController } from '../controller/fine.controller';

export function fineRoutes(controller: FineController): Router {
  const router = Router();

  router.get('/fines', (req: Request, res: Response): void => {
    controller.getFines(res);
  });

  router.post('/fines', async (req: Request, res: Response): Promise<void> => {
    controller.addFine(req, res);
  });

  return router;
}
