import { Request, Response, Router } from 'express';
import { LOGIN_SCHEMA, LoginController } from '../controller/login.controller';
import { requireAdminRights } from '../middleware/auth';
import { Validator } from '../util/validator';

const loginValidator = new Validator(LOGIN_SCHEMA);

export function loginRoutes(controller: LoginController): Router {
  const router = Router();

  router.post('/', loginValidator.middleware(), (req: Request, res: Response) =>
    controller.login(req, res)
  );

  // FIXME Remove debug functions
  const testFunction = (req: Request, res: Response): void => {
    res.json({
      firstName: req.currentUser?.firstName,
      lastName: req.currentUser?.lastName,
      admin: req.currentUser?.admin,
    });
  };

  // FIXME Remove debug route
  router.get('/login/test', testFunction);

  // FIXME Remove debug functions
  router.get('/login/test/admin', requireAdminRights, testFunction);

  return router;
}
