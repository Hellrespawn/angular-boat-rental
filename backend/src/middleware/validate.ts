import { NextFunction, Request, Response } from 'express';
import { Middleware } from '.';

/**
 * Middleware to check the ID in the url.
 */
export function validateIdInUrlParams(name?: string): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params[name ?? 'id']);
    if (isNaN(id) || id < 0) {
      res.status(400).json({ message: 'ID must be a positive integer!', id });
    } else {
      next();
    }
  };
}
