import { Session } from '../model/session.model';
import { User } from '../model/user.model';
import jwt from 'jsonwebtoken';

export type Payload = {
  userId: number;
  emailAddress: string;
  firstName: string;
  admin: boolean;
};

export function getSecret(): string {
  return 'secret_password';
}

export class SessionService {
  public async login(email: string, password: string): Promise<Session> {
    const user = await User.findOne({
      where: {
        emailAddress: email,
        password,
      },
    });

    if (user) {
      return this.createSession(user);
    } else {
      throw 'Invalid credentials!';
    }
  }

  public async createSession(user: User): Promise<Session> {
    const payload: Payload = {
      userId: user.id,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      admin: user.admin,
    };

    const token = jwt.sign(payload, getSecret());

    return await Session.create({ userId: user.id, token });
  }
}
