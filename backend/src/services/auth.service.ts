import { User } from '../model/user.model';
import jwt from 'jsonwebtoken';
import { ErrorType, ServerError } from '../util/error';

type Token = string;

/**
 * The information used to render the frontend.
 */
export type Payload = {
  sub: number; // Registered claim
  firstName: string; // Private claim
  admin: boolean; // Private claim
};

export class AuthService {
  // Format described here: https://github.com/vercel/ms
  public static MAX_TOKEN_AGE = '7 days';

  /**
   * @returns The secret key which signs our JSON Web Tokens.
   */
  public static getSecret(): string {
    return 'secret_password';
  }

  /**
   * Checks if there is a user identified by email and password and creates a
   * JSON Web Token for them.
   *
   * @param email - email address
   * @param password - password
   * @returns - token
   */
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

  /**
   * Generate a JSON Web Token.
   * @param user The user identified by the token
   * @returns a JSON Web Token
   */
  public async generateToken(user: User): Promise<Token> {
    const payload: Payload = {
      sub: user.id,
      firstName: user.firstName,
      admin: user.admin,
    };

    const token = jwt.sign(payload, AuthService.getSecret());

    return token;
  }
}
