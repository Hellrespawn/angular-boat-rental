import { Request, Response, Router } from 'express';
import { CustomerController } from '../controller/customer.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function customerRoutes(controller: CustomerController): Router {
  const router = Router();

  router.get(
    '/customer',
    async (req: Request, res: Response): Promise<void> => {
      controller.getCustomers(res);
    }
  );

  router.delete(
    '/delete-customer/:id',
    validateIdInUrlParams,
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteCustomer(req, res);
    }
  );

  router.patch(
    '/update-customer',
    async (req: Request, res: Response): Promise<void> => {
      controller.updateCustomer(req, res);
    }
  );

  return router;
}
