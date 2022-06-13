import { NextFunction, Request, Response } from 'express';
import { SessionData, SessionService } from '../services/session.service';

export async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const string: string | undefined = req.cookies.session;

  if (!string) {
    return next();
  }

  let sessionData: SessionData;

  try {
    sessionData = JSON.parse(string);
  } catch (error) {
    console.error(error);
    return next();
  }

  const session = await new SessionService().getSession(sessionData.sessionId);

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
