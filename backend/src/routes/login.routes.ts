import { Request, Response, Router } from 'express';
import { LOGIN_SCHEMA, LoginController } from '../controller/login.controller';
import { authenticate, requireAdminRights } from '../middleware/auth';

import {
  createMiddlewareFromValidator,
  createValidatorFromSchema,
} from '../middleware/validate';

const validateLogin = createMiddlewareFromValidator(
  createValidatorFromSchema(LOGIN_SCHEMA)
);

export function loginRoutes(controller: LoginController): Router {
  const router = Router();

  router.post('/login', validateLogin, (req: Request, res: Response) =>
    controller.login(req, res)
  );

  // FIXME Remove debug functions
  const testFunction = (req: Request, res: Response): void => {
    res.json({
      firstName: req.currentUser!.firstName,
      lastName: req.currentUser!.lastName,
      admin: req.currentUser!.admin,
    });
  };

  // FIXME Remove debug route
  router.get('/login/test', authenticate, testFunction);

  router.get(
    '/login/test/admin',
    authenticate,
    requireAdminRights,
    testFunction
  );
  // FIXME Remove debug functions

  return router;
}
