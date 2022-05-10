import { Request, Response, Router } from 'express';
import { loginSchema, LoginController } from '../controller/login.controller';
import { authenticate } from '../middleware/authenticate';

import {
  createMiddlewareFromValidator,
  createValidatorFromSchema,
} from '../middleware/validate';

const validateLogin = createMiddlewareFromValidator(
  createValidatorFromSchema(loginSchema)
);

export function loginRoutes(controller: LoginController): Router {
  const router = Router();

  router.post('/login', validateLogin, (req: Request, res: Response) =>
    controller.login(req, res)
  );

  router.get('/login/test', authenticate, (req, res) =>
    res.json({ response: 'Authenticated', payload: req.payload })
  );

  return router;
}
