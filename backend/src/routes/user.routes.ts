import { Request, Response, Router } from 'express';
import { UserController } from '../controller/user.controller';
import { validateIdInUrlParams } from '../middleware/validate';

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get('/users', async (req: Request, res: Response): Promise<void> => {
    controller.getUsers(res);
  });

  router.get(
    '/users/:id/rentals/next',
    validateIdInUrlParams(),
    async (req: Request, res: Response): Promise<void> => {
      controller.getNextRentalForUser(req, res);
    }
  );

  router.delete(
    '/users/:id',
    validateIdInUrlParams(),
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteUser(req, res);
    }
  );

  router.patch('/users', async (req: Request, res: Response): Promise<void> => {
    controller.updateUser(req, res);
  });

  return router;
}
