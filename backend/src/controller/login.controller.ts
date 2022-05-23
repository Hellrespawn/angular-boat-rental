import { JSONSchemaType } from 'ajv';
import { Request, Response } from 'express';
import { SessionData, SessionService } from '../services/session.service';
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
  constructor(private sessionService = new SessionService()) {}

  /**
   * Handles login requests.
   */
  public async login(req: Request, res: Response): Promise<void> {
    // Validated by middleware
    const email: string = req.body.email;
    const password: string = req.body.password;

    try {
      const session = await this.sessionService.login(email, password);

      const user = (await session.$get('user'))!;

      const sessionData: SessionData = {
        sessionId: session.sessionId,
        license: user.license,
        admin: user.admin,
        firstName: user.firstName,
      };

      res
        .cookie('session', JSON.stringify(sessionData), { sameSite: 'lax' })
        .json({ session: sessionData });
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}