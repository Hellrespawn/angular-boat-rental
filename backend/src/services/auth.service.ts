import { User } from '../model/user.model';
import jwt from 'jsonwebtoken';
import { ErrorType, ServerError } from '../util/error';

type Token = string;

export type Payload = {
  userId: number;
  emailAddress: string;
  firstName: string;
  admin: boolean;
};

export function getSecret(): string {
  return 'secret_password';
}

export class AuthService {
  public async login(email: string, password: string): Promise<Token> {
    const user = await User.findOne({
      where: {
        emailAddress: email,
        password,
      },
    });

    if (user) {
      return this.generateToken(user);
    } else {
      throw new ServerError('Invalid credentials!', ErrorType.Forbidden);
    }
  }

  public async generateToken(user: User): Promise<Token> {
    const payload: Payload = {
      userId: user.id,
      emailAddress: user.emailAddress,
      firstName: user.firstName,
      admin: user.admin,
    };

    const token = jwt.sign(payload, getSecret());

    return token;
  }
}
