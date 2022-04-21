import { Request, Response, Router } from 'express';
import { RentalController } from '../controller/rental.controller';

export function rentalRoutes(controller: RentalController): Router {
  const router = Router();

  router.get('/rentals/upcoming');
  router.get('/rentals/current');
  router.get('/rentals/past');

  return router;
}
