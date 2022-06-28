import { Router } from 'express';
import {
  NEW_RENTAL_SCHEMA,
  RentalController,
} from '../controller/rental.controller';
import { requireAuthentication } from '../middleware/auth';
import { Validator } from '../util/validator';

const NEW_RENTAL_VALIDATOR = new Validator(NEW_RENTAL_SCHEMA);

export function getRentalRouter(): Router {
  const rentalController = RentalController.getInstance();
  const router = Router();

  router.post(
    '/',
    requireAuthentication,
    NEW_RENTAL_VALIDATOR.middleware(),
    rentalController.addRental.bind(rentalController)
  );

  return router;
}
