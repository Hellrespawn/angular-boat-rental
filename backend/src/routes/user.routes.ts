/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';
import { NEW_USER_SCHEMA, UserController } from '../controller/user.controller';
import { requireAdminRights, requireAuthentication } from '../middleware/auth';
import { validateIdInUrlParams } from '../middleware/validate';
import { Validator } from '../util/validator';

const NEW_USER_VALIDATOR = new Validator(NEW_USER_SCHEMA);

export function getUserRouter(): Router {
  const userController = UserController.getInstance();
  const router = Router();

  router.post(
    '/register',
    NEW_USER_VALIDATOR.middleware(),
    userController.register.bind(userController)
  );

  router.get(
    '/rentals/next',
    requireAuthentication,
    userController.getNextRental.bind(userController)
  );

  router.get(
    '/overview',
    requireAdminRights,
    userController.getOverviewData.bind(userController)
  );

  router.delete(
    '/:id',
    validateIdInUrlParams(),
    requireAdminRights,
    userController.delete.bind(userController)
  );

  router.patch(
    '/:id/blocked/toggle',
    validateIdInUrlParams(),
    requireAdminRights,
    userController.toggleBlocked.bind(userController)
  );

  return router;
}
