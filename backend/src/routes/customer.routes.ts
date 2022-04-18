import { Request, Response, Router } from 'express';
import { CustomerController } from '../controller/customer.controllers';
import { validateIdInUrlParams } from '../middleware/validate';

export function customerRoutes(controller: CustomerController): Router {
  const router = Router();

  // TODO Check if boat available between dates
  router.get('/boat/:id/:dateStart/:dateEnd', validateIdInUrlParams);

  // TODO Get availability for all boats
  router.get('/boat/:dateStart/:dateEnd');

  return router;
}
