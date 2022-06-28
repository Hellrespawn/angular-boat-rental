import { Router } from 'express';
import { getBoatRouter } from './boat.routes';
import { getImageRouter } from './image.routes';
import { getLoginRouter } from './login.routes';
import { getRentalRouter } from './rental.routes';
import { getUserRouter } from './user.routes';

export interface Route {
  prefix: string;
  router: Router;
}

export const ROUTES = [
  { prefix: '/boats', router: getBoatRouter() },
  { prefix: '/rentals', router: getRentalRouter() },
  { prefix: '/images', router: getImageRouter() },
  { prefix: '/users', router: getUserRouter() },
  { prefix: '/login', router: getLoginRouter() },
];
