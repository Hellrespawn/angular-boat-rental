import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

export type Token = string;

export type Payload = {
  userId: number;
  firstName: string;
  admin: boolean;
};

export function decodeToken(token: Token): Payload {
  return helper.decodeToken(token);
}
