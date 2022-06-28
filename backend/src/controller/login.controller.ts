import { type JSONSchemaType } from 'ajv';
import { type Request, type Response } from 'express';
import { SessionService } from '../services/session.service';
import { ServerError } from '../util/error';

interface LoginData {
  email: string;
  password: string;
}

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
  private static instance?: LoginController;

  private constructor(private sessionService = SessionService.getInstance()) {}

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
    const { email, password } = req.body;

    try {
      const session = await this.sessionService.login(
        email as string,
        password as string
      );

      const { user } = session;

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
