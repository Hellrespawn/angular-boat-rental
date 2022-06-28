/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { requireAdminRights, requireAuthentication } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';

export function getUserRouter(): Router {
  const userController = UserController.getInstance();
  const router = Router();

  router.post('/register', userController.save.bind(userController));

  router.get(
    '/rentals/next',
    requireAuthentication,
    userController.getNextRental.bind(userController)
  );

  router.delete(
    '/:id',
    validateIdInUrlParams(),
    requireAdminRights,
    userController.delete.bind(userController)
  );

  return router;
}
