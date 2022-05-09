import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { SessionService } from '../services/session.service';

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

export class SessionController {
  constructor(private sessionService = new SessionService()) {}

  public async login(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
      const session = await this.sessionService.login(email, password);

      res.json({ token: session.token });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  }
}
