import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getSecret, Payload } from '../services/auth.service';

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'Authorization required!' });
    return;
  }

  const payload = jwt.verify(token, getSecret()) as JwtPayload & Payload;

  if (!payload.admin) {
    res
      .status(401)
      .json({ error: `User ${payload.emailAddress} is not an admin!` });
    return;
  }

  next();
}
