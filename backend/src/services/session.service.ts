import { SessionDao } from '../database/session.dao';
import { Session } from '../model/session';
import { Cache } from '../util/cache';
import { ErrorType, ServerError } from '../util/error';
import { UserService } from './user.service';

export type SessionData = {
  sessionId: string;
  license: boolean;
  admin: boolean;
  firstName: string;
};

export class SessionService {
  private static instance: SessionService;

  public static MaxSessionAge = 14;

  private cache: Cache<Session> = new Cache();

  private constructor(
    private userService = UserService.getInstance(),
    private sessionDao = SessionDao.getInstance()
  ) {
    // Intentionally left blank
  }

  public static getInstance(): SessionService {
    if (!this.instance) {
      this.instance = new SessionService();
    }

    return this.instance;
  }

  /**
   * Checks user existence and password and, if applicable , creates a session
   *
   * @param email - email of user to check
   * @param password - password to check
   * @returns a session
   */
  public async login(email: string, password: string): Promise<Session> {
    const user = await this.userService.getUserByEmail(email);

    if (!user || !(await user.verifyPassword(password))) {
      // Single error, so as to not provide more information than necessary.
      throw new ServerError('Invalid Credentials', ErrorType.Forbidden);
    }

    const session = Session.createSessionForUser(user);

    await this.sessionDao.saveSession(session);
    this.cache.set(session.sessionId, session);

    return session;
  }

  /**
   * Attempts to return a session
   *
   * @param sessionId
   * @returns
   */
  public async getSession(sessionId: string): Promise<Session | null> {
    let session: Session | null;

    try {
      session =
        this.cache.get(sessionId) ??
        (await this.sessionDao.getSession(sessionId));
    } catch (error) {
      console.error(error);
      throw new ServerError('Unable to connect to database!', ErrorType.Server);
    }

    if (session) {
      if (session.isExpired()) {
        await this.sessionDao.deleteSession(session);
        this.cache.delete(sessionId);

        session = null;
      } else {
        this.cache.set(sessionId, session);
      }
    }

    return session;
  }

  /**
   * Clears expired sessions.
   * @returns the number of sessions cleared.
   */
  public async clearExpiredSessions(): Promise<number> {
    const sessions = await this.sessionDao.getAllSessions();
    let count = 0;

    for (const session of sessions) {
      if (session.isExpired()) {
        this.sessionDao.deleteSession(session);
        this.cache.delete(session.sessionId);
        count++;
      }
    }

    return count;
  }
}
