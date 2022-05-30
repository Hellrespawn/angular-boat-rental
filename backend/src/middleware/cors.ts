import { NextFunction, Request, Response } from 'express';

export function addCorsHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,authorization'
  );

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // On CORS preflight request stop immediately with success code
  //
  // If you do not end the connection, a normal request
  // "POST: http://localhost:3000/login" will have a prior preflight request:
  // "OPTIONS: http://localhost:3000/login". In this preflight request the
  // correct CORS headers will be set, but the following catch-all route will
  // set the 404 status code. The 404 status code takes precedence over the
  // CORS headers and the preflight will fail.
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Pass to next layer of middleware
  next();
}
