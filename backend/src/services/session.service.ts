import { Session } from '../model/session.model';
import { User } from '../model/user.model';
import { ErrorType, ServerError } from '../util/error';

export class SessionService {
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
    const user = await User.findOne({
      where: {
        emailAddress: email,
      },
    });

    if (!user || !(await user.verifyPassword(password))) {
      throw new ServerError('Invalid credentials!', ErrorType.Forbidden);
    }

    return this.generateSession(user);
  }

  public async getSession(sessionId: string): Promise<Session | null> {
    return Session.findOne({ where: { sessionId }, include: [User] });
  }

  private async generateSession(user: User): Promise<Session> {
    return Session.create({ userId: user.id });
  }
}
