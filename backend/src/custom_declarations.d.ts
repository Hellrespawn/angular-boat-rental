// This is necessary, for unknown reasons.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from 'express-serve-static-core';

// Found here: https://stackoverflow.com/a/55718334

declare module 'express-serve-static-core' {
  interface Request {
    payload?: JwtPayload & Payload;
  }
  //   interface Response {
  //     myField?: string;
  //   }
}
