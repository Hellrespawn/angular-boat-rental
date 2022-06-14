import { Request, Response, Router } from 'express';
import { Validator } from '../util/validator';
import { FineController, NEW_FINE_SCHEMA } from '../controller/fine.controller';

const newFineValidator = new Validator(NEW_FINE_SCHEMA);

export function fineRoutes(controller: FineController): Router {
  const router = Router();

  router.get('/fines', (req: Request, res: Response): void => {
    controller.getFines(res);
  });

  router.post(
    '/fines',
    newFineValidator.middleware(),
    async (req: Request, res: Response): Promise<void> => {
      controller.addFine(req, res);
    }
  );

  return router;
}
