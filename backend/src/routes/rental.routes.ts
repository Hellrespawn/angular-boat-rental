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
    '/rental/',
    validateNewRental,
    controller.addRental.bind(controller)
  );

  router.get('/rental/upcoming');
  router.get('/rental/current');
  router.get('/rental/past');

  return router;
}
