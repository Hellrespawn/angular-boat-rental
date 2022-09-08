import { SessionDao } from '../persistence/session.dao';
import { Session } from '../model/session';
import { Cache } from '../util/cache';
import { ErrorType, ServerError } from '../util/error';
import { UserService } from './user.service';
import { User } from '../model/user';

export class SessionService {
  public static MaxSessionAge = 14;

  private static instance?: SessionService;

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
    const user = await this.userService.getByEmail(email);

    if (!user || !(await user.verifyPassword(password))) {
      // Single error, so as to not provide more information than necessary.
      throw ServerError.createForbiddenError();
    }

    if (user.blocked) {
      throw ServerError.createBlockedError();
    }

    const session = Session.createSessionForUser(user);

    await this.sessionDao.save(session);
    this.cache.set(session.sessionId, session);

    return session;
  }

  public async logout(session: Session): Promise<void> {
    const deleted =
      this.cache.delete(session.sessionId) ||
      (await this.sessionDao.delete(session));

    if (!deleted) {
      throw new ServerError(`Session ${session.sessionId} does not exist!`);
    }
  }

  /**
   * Attempts to return a session
   *
   * @param sessionId
   * @returns
   */
  public async getBySessionId(sessionId: string): Promise<Session | null> {
    let session: Session | null;

    try {
      session =
        this.cache.get(sessionId) ??
        (await this.sessionDao.getBySessionId(sessionId));
    } catch (error) {
      console.error(error);
      throw new ServerError('Unable to connect to database!', ErrorType.Server);
    }

    if (session) {
      if (session.isExpired()) {
        await this.sessionDao.delete(session);
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
    const sessions = await this.sessionDao.getAll();
    let count = 0;

    const promises: Promise<boolean>[] = [];

    for (const session of sessions) {
      if (session.isExpired()) {
        promises.push(this.sessionDao.delete(session));
        this.cache.delete(session.sessionId);
        count++;
      }
    }

    await Promise.all(promises);

    return count;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public async delete(session: Session): Promise<void> {
    await this.sessionDao.delete(session);
  }

  public async deleteForUser(user: User): Promise<number> {
    const sessions = await this.sessionDao.getSessionsByUserId(user.id);

    let count = 0;

    await Promise.all(
      sessions.map(async (session) => {
        await this.sessionDao.delete(session);
        count++;
      })
    );

    return count;
  }
}
