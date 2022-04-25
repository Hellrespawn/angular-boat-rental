import { Router } from 'express';
import {
  newRentalSchema,
  RentalController,
} from '../controller/rental.controller';
import {
  createMiddlewareFromValidator,
  createValidatorFromSchema,
} from '../middleware/validate';

const validateNewRental = createMiddlewareFromValidator(
  createValidatorFromSchema(newRentalSchema)
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
