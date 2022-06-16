import { Request, Response, Router } from 'express';
import { UserController } from '../controller/user.controller';
import { requireAdminRights, requireAuthentication } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';

export function userRoutes(controller: UserController): Router {
  const router = Router();

  router.get(
    '/',
    requireAdminRights,
    async (req: Request, res: Response): Promise<void> => {
      controller.getUsers(res);
    }
  );

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
    requireAdminRights,
    async (req: Request, res: Response): Promise<void> => {
      controller.deleteUser(req, res);
    }
  );

  router.patch(
    '/',
    requireAdminRights,
    async (req: Request, res: Response): Promise<void> => {
      controller.updateBlockedValueOfUser(req, res);
    }
  );

  return router;
}
