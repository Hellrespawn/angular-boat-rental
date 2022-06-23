import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../services/session.service';

/**
 * Middleware that checks for a cookie and, if present, attempts to
 * authenticate the user, setting req.currentUser.
 *
 * @param req
 * @param res
 * @param next
 * @returns Middleware function
 */
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

/**
 * Middleware that requires authentication on a route
 *
 * @param req
 * @param res
 * @param next
 * @returns Middleware function
 */
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

/**
 * Middleware that requires admin rights on a route
 *
 * @param req
 * @param res
 * @param next
 * @returns Middleware function
 */
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
