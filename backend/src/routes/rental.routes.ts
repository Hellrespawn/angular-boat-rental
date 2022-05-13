import { Router } from 'express';
import {
  NEW_RENTAL_SCHEMA,
  RentalController,
} from '../controller/rental.controller';
import {
  createMiddlewareFromValidator,
  createValidatorFromSchema,
} from '../middleware/validate';

const validateNewRental = createMiddlewareFromValidator(
  createValidatorFromSchema(NEW_RENTAL_SCHEMA)
);

export function rentalRoutes(controller: RentalController): Router {
  const router = Router();

  router.post(
    '/rentals/',
    validateNewRental,
    controller.addRental.bind(controller)
  );

  router.get('/rentals/upcoming');
  router.get('/rentals/current');
  router.get('/rentals/past');

  return router;
}
