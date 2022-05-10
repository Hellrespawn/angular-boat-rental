import { Router } from 'express';
import { loginSchema, LoginController } from '../controller/login.controller';
import { requireAdmin } from '../middleware/authenticate';

import {
  createMiddlewareFromValidator,
  createValidatorFromSchema,
} from '../middleware/validate';

const validateLogin = createMiddlewareFromValidator(
  createValidatorFromSchema(loginSchema)
);

export function loginRoutes(controller: LoginController): Router {
  const router = Router();

  router.post('/login', validateLogin, controller.login.bind(controller));

  router.get('/login/test', requireAdmin, (req, res) =>
    res.json({ response: 'Authorized' })
  );

  return router;
}
