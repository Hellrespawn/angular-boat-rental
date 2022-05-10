import { User } from '../model/user.model';
import jwt from 'jsonwebtoken';
import { ErrorType, ServerError } from '../util/error';

type Token = string;

export type Payload = {
  userId: number;
  firstName: string;
  admin: boolean;
};

export class AuthService {
  // Format described here: https://github.com/vercel/ms
  public static MAX_TOKEN_AGE = '7 days';

  public static getSecret(): string {
    return 'secret_password';
  }

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
      firstName: user.firstName,
      admin: user.admin,
    };

    const token = jwt.sign(payload, AuthService.getSecret());

    return token;
  }
}
