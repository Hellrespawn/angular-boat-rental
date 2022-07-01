import { Session } from './model/session';
import { User } from './model/user';

// Found here: https://github.com/TypeStrong/ts-node/issues/745#issuecomment-870045984
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
      currentSession?: Session;
    }
  }
}
