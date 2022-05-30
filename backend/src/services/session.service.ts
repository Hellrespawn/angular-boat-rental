import { SessionDao } from '../database/session.dao';
import { Session } from '../model/session';
import { ErrorType, ServerError } from '../util/error';
import { UserService } from './user.service';

export type SessionData = {
  sessionId: string;
  license: boolean;
  admin: boolean;
  firstName: string;
};

export class SessionService {
  private userService: UserService = new UserService();

  private sessionDao: SessionDao = new SessionDao();

  // Format described here: https://github.com/vercel/ms
  public static MAX_SESSION_AGE = 14;

  /**
   * Checks if there is a user identified by email and password and creates a
   * JSON Web Token for them.
   *
   * @param email - email address
   * @param password - password
   * @returns - token
   */
  public async login(email: string, password: string): Promise<Session> {
    const user = await this.userService.getUser(email);

    if (!user || !user.verifyPassword(password)) {
      throw new ServerError('Invalid Credentials', ErrorType.Forbidden);
    }

    const session = Session.createSessionForUser(user);

    await this.sessionDao.saveSession(session);

    return session;
  }

  public async getSession(sessionId: string): Promise<Session | null> {
    return await this.sessionDao.getSession(sessionId);
  }
}
