import { JwtHelperService } from '@auth0/angular-jwt';

const HELPER = new JwtHelperService();

export type Token = string;

export type CurrentUserData = {
  sub: number;
  firstName: string;
  license: boolean;
  admin: boolean;
};

/**
 * Decodes token payload. As the payload is only for authentication, we don't
 * need to verify it here.
 *
 * @param token JSON Web Token
 * @returns Payload
 */
export function decodeToken(token: Token): CurrentUserData {
  return HELPER.decodeToken(token);
}
