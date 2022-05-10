import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ServerError } from '../util/error';

type LoginData = {
  email: string;
  password: string;
};

export const loginSchema: JSONSchemaType<LoginData> = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

export class LoginController {
  constructor(private authService = new AuthService()) {}

  public async login(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
      const token = await this.authService.login(email, password);

      res.json({ token });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
