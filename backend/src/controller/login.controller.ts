import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { ServerError } from '../util/error';

type LoginData = {
  email: string;
  password: string;
};

export const LOGIN_SCHEMA: JSONSchemaType<LoginData> = {
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
  private static instance: LoginController;

  private constructor(private sessionService = new SessionService()) {}

  public static getInstance(): LoginController {
    if (!this.instance) {
      this.instance = new LoginController();
    }

    return this.instance;
  }

  /**
   * Handles login requests.
   */
  public async login(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
      const session = await this.sessionService.login(email, password);

      const user = session.user;

      const expires = new Date();
      expires.setDate(expires.getDate() + SessionService.MaxSessionAge);

      res
        .cookie('session', session.sessionId, {
          expires,
          secure: true,
          httpOnly: true,
          sameSite: 'strict',
        })
        .json({
          license: user.license,
          admin: user.admin,
          firstName: user.firstName,
        });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
