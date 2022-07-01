import { Router } from 'express';
import { LOGIN_SCHEMA, SessionController } from '../controller/session.controller';
import { requireAuthentication } from '../middleware/auth';
import { Validator } from '../util/validator';

const loginValidator = new Validator(LOGIN_SCHEMA);

export function getSessionRouter(): Router {
  const sessionController = SessionController.getInstance();
  const router = Router();

  router.post(
    '/login',
    loginValidator.middleware(),
    sessionController.login.bind(sessionController)
  );

  router.delete(
    '/logout',
    requireAuthentication,
    sessionController.logout.bind(sessionController)
  );

  return router;
}
