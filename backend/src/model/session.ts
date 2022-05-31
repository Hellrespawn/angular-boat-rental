import { randomBytes } from 'crypto';
import { SessionModel } from '../database/session.dao';
import { SessionService } from '../services/session.service';
import { User } from './user';

export class Session {
  constructor(
    public id: number,
    public sessionId: string,
    public user: User,
    public createdAt: Date
  ) {}

  /**
   * Create session from model.
   */
  public static async fromModel(model: SessionModel): Promise<Session> {
    const user = model.user ?? (await model.$get('user'));
    return new Session(
      model.id,
      model.sessionId,
      User.fromModel(user),
      model.createdAt
    );
  }

  /**
   * Creates new session for user.
   * @param user
   * @returns
   */
  public static createSessionForUser(user: User): Session {
    return new Session(-1, this.generateSessionId(), user, new Date());
  }

  /**
   * Generates a random sessionId
   */
  private static generateSessionId(): string {
    // 32 -> extras secure!
    return randomBytes(32).toString('base64');
  }

  /**
   * Checks whether createdAt is more than MaxSessionAge days ago
   */
  public isExpired(): boolean {
    const msElapsed = new Date().getTime() - this.createdAt.getTime();

    const daysElapsed = msElapsed / 1000 / 60 / 60 / 24;

    return daysElapsed > SessionService.MaxSessionAge;
  }
}
