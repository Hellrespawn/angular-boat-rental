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
