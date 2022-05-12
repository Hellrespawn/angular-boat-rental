import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { AuthService, Payload } from '../services/auth.service';

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'Authentication required!' });
    return;
  }

  try {
    const payload = jwt.verify(token, AuthService.getSecret(), {
      maxAge: AuthService.MAX_TOKEN_AGE,
    }) as JwtPayload & Payload;
    req.payload = payload;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ error });
    }
  }
}
