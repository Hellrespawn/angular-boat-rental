import { type JSONSchemaType } from 'ajv';
import { type CookieOptions, type Request, type Response } from 'express';
import { SessionService } from '../services/session.service';
import { ServerError } from '../util/error';
import { type LoginData, type SessionData } from 'auas-common';

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

export class SessionController {
  private static instance?: SessionController;

  private constructor(private sessionService = SessionService.getInstance()) {}

  public static getInstance(): SessionController {
    if (!this.instance) {
      this.instance = new SessionController();
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

      const sessionCookieOptions: CookieOptions = {
        expires,
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      };

      const sessionData: SessionData = {
        license: user.license,
        admin: user.admin,
        firstName: user.firstName,
      };

      res
        .cookie('session', session.sessionId, sessionCookieOptions)
        .json(sessionData);
    } catch (error) {
      ServerError.respond(error, res);
    }
  }

  /**
   * Handles logout requests.
   */
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      // Validated by middleware
      await this.sessionService.logout(req.currentSession!);

      res.status(200).end();
    } catch (error) {
      ServerError.respond(error, res);
    }
  }
}
