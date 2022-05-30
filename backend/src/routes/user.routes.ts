import { Request, Response, Router } from 'express';
import { UserController } from '../controller/user.controller';
import { requireAuthentication } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response): Promise<void> => {
    controller.getUsers(res);
  });

  router.post(
    '/registratie-pagina',
    async (req: Request, res: Response): Promise<void> => {
      controller.sendUserToDB(req, res);
    }
  );
  router.get(
    '/rentals/next',
    requireAuthentication,
    async (req: Request, res: Response): Promise<void> => {
      controller.getNextRentalForUser(req, res);
    }
  );

  router.delete(
    '/:id',
    validateIdInUrlParams(),
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteUser(req, res);
    }
  );

  router.patch('/', async (req: Request, res: Response): Promise<void> => {
    controller.updateUser(req, res);
  });

  return router;
}
