// This is necessary, for unknown reasons.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from 'express-serve-static-core';
import { User } from './model/user';

// Found here: https://stackoverflow.com/a/55718334

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User;
  }
  //   interface Response {
  //     myField?: string;
  //   }
}
