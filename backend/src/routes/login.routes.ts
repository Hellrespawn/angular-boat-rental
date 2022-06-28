import { Router } from 'express';
import { LOGIN_SCHEMA, LoginController } from '../controller/login.controller';
import { Validator } from '../util/validator';

const loginValidator = new Validator(LOGIN_SCHEMA);

export function getLoginRouter(): Router {
  const loginController = LoginController.getInstance();
  const router = Router();

  router.post(
    '/',
    loginValidator.middleware(),
    loginController.login.bind(loginController)
  );

  return router;
}
