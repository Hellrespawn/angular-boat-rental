import { Router } from 'express';
import {
  loginSchema,
  SessionController,
} from '../controller/session.controller';

import {
  createMiddlewareFromValidator,
  createValidatorFromSchema,
} from '../middleware/validate';

const validateLogin = createMiddlewareFromValidator(
  createValidatorFromSchema(loginSchema)
);

export function sessionRoutes(controller: SessionController): Router {
  const router = Router();

  router.post('/sessions', validateLogin, controller.login.bind(controller));

  return router;
}
