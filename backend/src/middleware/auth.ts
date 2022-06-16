import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../services/session.service';

export async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const sessionId: string | undefined = req.cookies.session;

  if (!sessionId) {
    return next();
  }

  const session = await new SessionService().getSession(sessionId);

  if (session) {
    req.currentUser = session.user;
  }

  next();
}

export async function requireAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.currentUser) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  next();
}

export async function requireAdminRights(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.currentUser || !req.currentUser.admin) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  next();
}
