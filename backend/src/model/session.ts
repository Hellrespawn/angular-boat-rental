import { randomBytes } from 'crypto';
import { SessionModel } from '../persistence/session.model';
import { SessionService } from '../services/session.service';
import { User } from './user';

export class Session {
  constructor(
    public id: number,
    public readonly sessionId: string,
    public readonly user: User,
    private createdAt: Date
  ) {}

  /**
   * Create session from model.
   */
  public static fromModel(model: SessionModel): Session {
    return new Session(
      model.id as number,
      model.sessionId,
      User.fromModel(model.user),
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
    const expired = new Date(this.createdAt);
    expired.setDate(expired.getDate() + SessionService.MaxSessionAge);

    const now = new Date();

    return now >= expired;
  }
}
