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

  public static MAX_SESSION_AGE = 14;

  /**
   * Checks user existence and password and, if applicable , creates a session
   *
   * @param email - email of user to check
   * @param password - password to check
   * @returns a session
   */
  public async login(email: string, password: string): Promise<Session> {
    const user = await this.userService.getUser(email);

    if (!user || !user.verifyPassword(password)) {
      // Single error, so as to not provide more information than necessary.
      throw new ServerError('Invalid Credentials', ErrorType.Forbidden);
    }

    const session = Session.createSessionForUser(user);

    await this.sessionDao.saveSession(session);

    return session;
  }

  /**
   * Attempts to return a session
   * @param sessionId
   * @returns
   */
  public async getSession(sessionId: string): Promise<Session | null> {
    return await this.sessionDao.getSession(sessionId);
  }
}
