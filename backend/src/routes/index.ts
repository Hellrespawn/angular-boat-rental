import { Router } from 'express';
import { getBoatRouter } from './boat.routes';
import { getImageRouter } from './image.routes';
import { getSessionRouter } from './session.routes';
import { getRentalRouter } from './rental.routes';
import { getUserRouter } from './user.routes';

export interface Route {
  prefix?: string;
  router: Router;
}

export const ROUTERS: Route[] = [
  { prefix: '/boats', router: getBoatRouter() },
  { prefix: '/rentals', router: getRentalRouter() },
  { prefix: '/images', router: getImageRouter() },
  { prefix: '/users', router: getUserRouter() },
  { router: getSessionRouter() },
];
