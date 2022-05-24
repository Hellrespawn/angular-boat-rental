import { randomBytes } from 'crypto';
import { SessionModel } from '../database/session.dao';
import { User } from './user';

export class Session {
  constructor(public sessionId: string, public user: User) {}

  public static async fromModel(model: SessionModel): Promise<Session> {
    const user = model.user ?? (await model.$get('user'));
    return new Session(model.sessionId, User.fromModel(user));
  }

  public static createSessionForUser(user: User): Session {
    return new Session(this.generateSessionId(), user);
  }

  private static generateSessionId(): string {
    return randomBytes(16).toString('base64');
  }
}
